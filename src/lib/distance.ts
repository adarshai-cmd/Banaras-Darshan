/**
 * Distance, Geolocation, and Real Transit Routing Utilities for Banaras Darshan
 */

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface RouteResult {
  distanceKm: number;
  durationMinutes: number;
  text: string;
  approxFare: string;
  isRealRoadNetwork: boolean;
  coordinates: [number, number][]; // [lat, lng] array for Leaflet polyline
  routeNotice?: string;
}

export const VARANASI_HUBS: Record<string, { name: string; desc: string; lat: number; lng: number }> = {
  cantt_station: {
    name: "Varanasi Cantt Railway Station (BSB)",
    desc: "Primary junction with express trains across India",
    lat: 25.3284,
    lng: 82.9868,
  },
  banaras_station: {
    name: "Banaras Railway Station (BSBS - Manduadih)",
    desc: "Modern terminal station on south-west side",
    lat: 25.2982,
    lng: 82.9649,
  },
  kashi_station: {
    name: "Kashi Railway Station (KEI)",
    desc: "Station near Malviya Bridge and Rajghat",
    lat: 25.3289,
    lng: 83.0371,
  },
  airport: {
    name: "Lal Bahadur Shastri Airport (VNS - Babatpur)",
    desc: "International airport ~25 km north of city center",
    lat: 25.4524,
    lng: 82.8593,
  },
  godowlia: {
    name: "Godowlia Crossing",
    desc: "Heart of old city, vehicles stop here before ghats",
    lat: 25.3090,
    lng: 83.0070,
  },
  assi: {
    name: "Assi Ghat",
    desc: "Southern gateway & cultural hub",
    lat: 25.2894,
    lng: 83.0068,
  },
};

/**
 * Calculates straight-line distance in kilometers using the Haversine formula
 */
export function calculateHaversineDistance(
  coord1: Coordinates,
  coord2: Coordinates
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(coord2.lat - coord1.lat);
  const dLng = toRad(coord2.lng - coord1.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coord1.lat)) *
      Math.cos(toRad(coord2.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }
  return `${distanceKm.toFixed(1)} km`;
}

/**
 * Queries OpenStreetMap Routing Machine (OSRM) for real road-network navigation
 * with graceful fallback to Haversine with Varanasi traffic buffers.
 */
export async function fetchOSRMRoute(
  start: Coordinates,
  end: Coordinates,
  mode: "AUTO" | "CAR" | "WALKING" | "BOAT"
): Promise<RouteResult> {
  // If boat mode, calculate along river curve
  if (mode === "BOAT") {
    const straightDist = calculateHaversineDistance(start, end);
    const distanceKm = straightDist * 1.15; // river bend factor
    const minutes = Math.max(15, Math.round((distanceKm / 8.0) * 60));
    return {
      distanceKm: parseFloat(distanceKm.toFixed(1)),
      durationMinutes: minutes,
      text: `${minutes} min river cruise`,
      approxFare: "₹150-300 per seat (Shared bajra)",
      isRealRoadNetwork: false,
      coordinates: [
        [start.lat, start.lng],
        [(start.lat + end.lat) / 2, (start.lng + end.lng) / 2],
        [end.lat, end.lng],
      ],
      routeNotice: "Scenic river route along the Ghats. Only licensed boats recommended.",
    };
  }

  const osrmProfile = mode === "WALKING" ? "walking" : "driving";
  const url = `https://router.project-osrm.org/route/v1/${osrmProfile}/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const distKm = parseFloat((route.distance / 1000).toFixed(1));
        // Add 5-8 min Varanasi old-city lane traffic buffer for motorized vehicles
        const buffer = mode === "WALKING" ? 0 : 7;
        const durationMins = Math.max(
          5,
          Math.round(route.duration / 60 + buffer)
        );

        // Convert GeoJSON [lng, lat] to Leaflet [lat, lng]
        const polylineCoords: [number, number][] = route.geometry.coordinates.map(
          (c: [number, number]) => [c[1], c[0]]
        );

        const fare = mode === "WALKING" ? "Free (Walking)" : "Fare unavailable";

        return {
          distanceKm: distKm,
          durationMinutes: durationMins,
          text: `${durationMins} min via ${mode === "AUTO" ? "Auto / E-Rickshaw" : mode === "CAR" ? "Cab / Taxi" : "Walking"}`,
          approxFare: fare,
          isRealRoadNetwork: true,
          coordinates: polylineCoords,
          routeNotice: "Route calculated via real OpenStreetMap road network.",
        };
      }
    }
  } catch {
    // Network or timeout failure - graceful fallback to Haversine
  }

  // Graceful deterministic fallback
  const fallbackDist = calculateHaversineDistance(start, end) * 1.35; // City road detour coefficient
  const fallback = estimateTravelTime(fallbackDist, mode);
  return {
    distanceKm: parseFloat(fallbackDist.toFixed(1)),
    durationMinutes: fallback.minutes,
    text: fallback.text,
    approxFare: fallback.approxFare,
    isRealRoadNetwork: false,
    coordinates: [
      [start.lat, start.lng],
      [end.lat, end.lng],
    ],
    routeNotice: "Approximate road distance based on local lane traffic patterns.",
  };
}

export function estimateTravelTime(
  distanceKm: number,
  mode: "WALKING" | "AUTO" | "CAR" | "BOAT"
): { minutes: number; text: string; approxFare: string } {
  switch (mode) {
    case "WALKING": {
      const minutes = Math.max(3, Math.round((distanceKm / 4.0) * 60));
      return {
        minutes,
        text: `${minutes} min walk`,
        approxFare: "Free",
      };
    }
    case "AUTO": {
      const minutes = Math.max(7, Math.round((distanceKm / 18) * 60 + 6));
      return {
        minutes,
        text: `${minutes} min via Auto / E-Rickshaw`,
        approxFare: "Fare unavailable",
      };
    }
    case "CAR": {
      const minutes = Math.max(10, Math.round((distanceKm / 20) * 60 + 8));
      return {
        minutes,
        text: `${minutes} min via Cab / Taxi`,
        approxFare: "Fare unavailable",
      };
    }
    case "BOAT": {
      const minutes = Math.max(15, Math.round((distanceKm / 8) * 60));
      return {
        minutes,
        text: `${minutes} min river cruise`,
        approxFare: "Shared boat fares vary locally",
      };
    }
  }
}
