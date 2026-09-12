import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

// In-memory weather cache
interface CachedWeather {
  timestamp: number;
  data: any;
}

let weatherCache: CachedWeather | null = null;

// Helper to interpret WMO Weather Code
function getWeatherCondition(code: number): { condition: string; icon: string } {
  switch (code) {
    case 0:
      return { condition: "Clear Sky", icon: "sun" };
    case 1:
      return { condition: "Mainly Clear", icon: "sun" };
    case 2:
      return { condition: "Partly Cloudy", icon: "cloud-sun" };
    case 3:
      return { condition: "Overcast", icon: "cloud" };
    case 45:
    case 48:
      return { condition: "Misty Haze", icon: "haze" };
    case 51:
    case 53:
    case 55:
      return { condition: "Light Drizzle", icon: "cloud-drizzle" };
    case 61:
    case 63:
    case 65:
      return { condition: "Rain Showers", icon: "cloud-rain" };
    case 71:
    case 73:
    case 75:
      return { condition: "Cool Breeze", icon: "wind" };
    case 80:
    case 81:
    case 82:
      return { condition: "Passing Showers", icon: "cloud-rain" };
    case 95:
    case 96:
    case 99:
      return { condition: "Thunderstorm", icon: "cloud-lightning" };
    default:
      return { condition: "Pleasant", icon: "sun" };
  }
}

// Helper to generate travel guidance based on real metrics
function generateTravelInsight(
  temp: number,
  condition: string,
  rainChance: number,
  customInsight?: string
): string {
  if (customInsight && customInsight.trim()) {
    return customInsight.trim();
  }

  if (rainChance > 45) {
    return "Passing showers possible — carry an umbrella and verify boat operation timings locally.";
  }
  if (temp > 35) {
    return "Warm afternoon expected. Early morning and twilight boat rides offer the most comfortable darshan experience.";
  }
  if (temp < 15) {
    return "Crisp and cool air on the river. A warm shawl or jacket is recommended for dawn Subah-e-Banaras.";
  }
  if (condition.toLowerCase().includes("clear") || condition.toLowerCase().includes("sunny")) {
    return "Superb conditions for exploring the 84 crescent ghats, morning temple corridors, and evening Maha Aarti.";
  }
  return "Pleasant travel conditions across Varanasi. Great day for walking through old city galliyan.";
}

export async function GET() {
  try {
    // 1. Fetch Admin Weather Configuration
    const settingRecord = await prisma.siteSetting.findUnique({
      where: { key: "weather_config" },
    });

    let config = {
      enabled: true,
      city: "Varanasi",
      country: "India",
      latitude: 25.3176,
      longitude: 82.9739,
      units: "metric", // metric or imperial
      cacheMinutes: 15,
      customTravelInsight: "",
    };

    if (settingRecord) {
      try {
        config = { ...config, ...JSON.parse(settingRecord.value) };
      } catch {}
    }

    if (!config.enabled) {
      return NextResponse.json({
        success: true,
        enabled: false,
        message: "Weather section disabled by administrator.",
      });
    }

    // 2. Check in-memory cache
    const now = Date.now();
    const cacheDurationMs = (config.cacheMinutes || 15) * 60 * 1000;

    if (weatherCache && now - weatherCache.timestamp < cacheDurationMs) {
      return NextResponse.json({
        success: true,
        cached: true,
        weather: weatherCache.data,
      });
    }

    // 3. Fetch from Open-Meteo (Reliable, Zero secret key exposure)
    const lat = config.latitude || 25.3176;
    const lng = config.longitude || 82.9739;
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,surface_pressure&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset,uv_index_max&timezone=Asia%2FKolkata&forecast_days=6`;

    const res = await fetch(apiUrl, { next: { revalidate: 900 } });

    if (!res.ok) {
      throw new Error(`Weather upstream responded with status ${res.status}`);
    }

    const json = await res.json();
    const current = json.current || {};
    const daily = json.daily || {};

    const weatherCode = current.weather_code ?? 0;
    const { condition, icon } = getWeatherCondition(weatherCode);

    const tempC = Math.round(current.temperature_2m ?? 28);
    const feelsLikeC = Math.round(current.apparent_temperature ?? tempC);
    const humidity = Math.round(current.relative_humidity_2m ?? 55);
    const windSpeedKm = Math.round(current.wind_speed_10m ?? 8);
    const rainChance = daily.precipitation_probability_max?.[0] ?? 10;

    let sunriseStr = "05:45 AM";
    let sunsetStr = "06:15 PM";
    if (daily.sunrise?.[0]) {
      const s = new Date(daily.sunrise[0]);
      sunriseStr = s.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
    }
    if (daily.sunset?.[0]) {
      const s = new Date(daily.sunset[0]);
      sunsetStr = s.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
    }

    // Format 5-Day Forecast
    const forecast = [];
    const dayNames = ["Today", "Tomorrow", "Day 3", "Day 4", "Day 5"];

    for (let i = 0; i < 5; i++) {
      const dateStr = daily.time?.[i];
      let dayLabel = dayNames[i];
      if (i >= 2 && dateStr) {
        const d = new Date(dateStr);
        dayLabel = d.toLocaleDateString("en-US", { weekday: "short" });
      }

      const fCode = daily.weather_code?.[i] ?? 0;
      const fCondition = getWeatherCondition(fCode);

      forecast.push({
        day: dayLabel,
        date: dateStr,
        maxTemp: Math.round(daily.temperature_2m_max?.[i] ?? tempC + 2),
        minTemp: Math.round(daily.temperature_2m_min?.[i] ?? tempC - 4),
        condition: fCondition.condition,
        icon: fCondition.icon,
        rainProbability: daily.precipitation_probability_max?.[i] ?? 10,
      });
    }

    const travelInsight = generateTravelInsight(
      tempC,
      condition,
      rainChance,
      config.customTravelInsight
    );

    const weatherData = {
      city: config.city || "Varanasi",
      country: config.country || "India",
      temperature: tempC,
      feelsLike: feelsLikeC,
      condition,
      icon,
      humidity,
      windSpeed: windSpeedKm,
      rainChance,
      sunrise: sunriseStr,
      sunset: sunsetStr,
      uvIndex: daily.uv_index_max?.[0] ? Math.round(daily.uv_index_max[0]) : 6,
      travelInsight,
      forecast,
      lastUpdated: new Date().toISOString(),
      isFallback: false,
    };

    // Save to memory cache
    weatherCache = {
      timestamp: now,
      data: weatherData,
    };

    return NextResponse.json({
      success: true,
      cached: false,
      weather: weatherData,
    });
  } catch (error) {
    console.error("Weather API error, serving fallback:", error);

    // Graceful fallback so website never breaks
    const fallbackData = {
      city: "Varanasi",
      country: "India",
      temperature: 28,
      feelsLike: 30,
      condition: "Pleasant & Clear",
      icon: "sun",
      humidity: 58,
      windSpeed: 8,
      rainChance: 10,
      sunrise: "05:45 AM",
      sunset: "06:15 PM",
      uvIndex: 6,
      travelInsight: "Pleasant conditions for morning boat rides and evening Ganga Aarti.",
      forecast: [
        { day: "Today", maxTemp: 31, minTemp: 22, condition: "Clear Sky", icon: "sun", rainProbability: 10 },
        { day: "Tomorrow", maxTemp: 32, minTemp: 23, condition: "Mainly Clear", icon: "sun", rainProbability: 15 },
        { day: "Day 3", maxTemp: 30, minTemp: 22, condition: "Partly Cloudy", icon: "cloud-sun", rainProbability: 20 },
        { day: "Day 4", maxTemp: 31, minTemp: 23, condition: "Clear Sky", icon: "sun", rainProbability: 10 },
        { day: "Day 5", maxTemp: 33, minTemp: 24, condition: "Sunny", icon: "sun", rainProbability: 5 },
      ],
      lastUpdated: new Date().toISOString(),
      isFallback: true,
    };

    return NextResponse.json({
      success: true,
      weather: fallbackData,
    });
  }
}
