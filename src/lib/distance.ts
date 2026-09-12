/**
 * Distance, Geolocation, and Transit Routing Utilities for Banaras Darshan
 */

export interface Coordinates {
  lat: number;
  lng: number;
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

export function estimateTravelTime(
  distanceKm: number,
  mode: "WALKING" | "AUTO" | "CAR" | "BOAT"
): { minutes: number; text: string; approxFare: string } {
  // Factoring Varanasi old city lane conditions and traffic
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
      // E-rickshaw / Auto: avg 15-18 km/h + 5 min traffic buffer
      const minutes = Math.max(7, Math.round((distanceKm / 18) * 60 + 5));
      const fare = distanceKm < 2 ? "₹30-50" : distanceKm < 6 ? "₹60-120" : "₹150-250";
      return {
        minutes,
        text: `${minutes} min via Auto / E-Rickshaw`,
        approxFare: fare,
      };
    }
    case "CAR": {
      // Cab / Taxi
      const minutes = Math.max(10, Math.round((distanceKm / 20) * 60 + 8));
      const fare = distanceKm > 15 ? "₹800-1100 (Airport cab)" : "₹250-450";
      return {
        minutes,
        text: `${minutes} min via Cab / Taxi`,
        approxFare: fare,
      };
    }
    case "BOAT": {
      // Traditional wooden hand boat or bajra on the Ganga
      const minutes = Math.max(15, Math.round((distanceKm / 8) * 60));
      return {
        minutes,
        text: `${minutes} min river cruise`,
        approxFare: "₹150-300 per seat",
      };
    }
  }
}
