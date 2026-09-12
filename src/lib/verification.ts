import { prisma } from "./db";

export interface VerificationCheckResult {
  isVerified: boolean;
  matchedPlaceId?: string;
  matchedPlaceName?: string;
  category?: string;
  note: string;
}

/**
 * Checks message text against known verified places in Banaras database.
 * If recognized with high confidence, links it to factual record.
 */
export async function verifyRecommendationClaim(
  content: string
): Promise<VerificationCheckResult> {
  const contentLower = content.toLowerCase();

  try {
    const allPlaces = await prisma.place.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        category: true,
        area: true,
        approxBudget: true,
      },
    });

    for (const place of allPlaces) {
      const placeNameLower = place.name.toLowerCase();
      // Look for place name occurrences or recognizable phrases
      if (
        contentLower.includes(placeNameLower) ||
        (place.slug && contentLower.includes(place.slug.replace(/-/g, " ")))
      ) {
        return {
          isVerified: true,
          matchedPlaceId: place.id,
          matchedPlaceName: place.name,
          category: place.category,
          note: `Verified entity: ${place.name} in ${place.area} (${place.category}). Factually indexed in Banaras Darshan database.`,
        };
      }
    }

    return {
      isVerified: false,
      note: "Community Recommendation — Not Yet Verified",
    };
  } catch (err) {
    console.error("Error in verification check:", err);
    return {
      isVerified: false,
      note: "Community Recommendation — Not Yet Verified",
    };
  }
}
