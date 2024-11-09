// src/routes/api/capture/+server.js
import { db } from "$lib/server/db/index.js";
import * as table from "$lib/server/db/schema";
import { confirmTrash } from "$lib/server/openai.js";
import { json } from "@sveltejs/kit";
import { eq, sql } from "drizzle-orm";

const calculateTrashScore = (category, impact, size) => {
  const categoryWeights = {
    organic: 1,
    paper: 2,
    glass: 3,
    metal: 4,
    household: 5,
    electronics: 6,
  };
  const impactWeights = {
    low: 1,
    medium: 2,
    high: 3,
  };
  const sizeWeights = {
    small: 1,
    medium: 2,
    large: 3,
  };

  // Calculate initial score based on weights
  const baseScore =
    categoryWeights[category] * 5 + impactWeights[impact] * 10 + sizeWeights[size] * 3;

  // Ensure the minimum score is 10
  return Math.max(baseScore, 10);
};

export async function POST({ request, locals }) {
  try {
    const { photoData, latitude, longitude, captureRecord } = await request.json();

    const [trashSpot] = await db
      .select()
      .from(table.trashSpots)
      .where(eq(table.trashSpots.id, captureRecord));

    if (!trashSpot) {
      return json({ error: "Trash spot not found" }, { status: 404 });
    }

    const classification = JSON.parse(await confirmTrash(trashSpot.image, photoData));

    const { containsTrashbin, containsTrash, isSameTrash } = classification;

    if (!containsTrash) {
      return json({ error: "No trash found" }, { status: 400 });
    }

    if (!containsTrashbin) {
      return json({ error: "No trash bin found" }, { status: 400 });
    }

    if (!isSameTrash) {
      return json({ error: "Trash does not match" }, { status: 400 });
    }

    let [trashBin] = await db
      .select()
      .from(table.trashBins)
      .where(
        sql`ST_DWithin(${table.trashBins.point}::geography, ST_MakePoint(${longitude}, ${latitude})::geography, 10)`,
      )
      .orderBy(sql`ST_Distance(ST_MakePoint(${longitude}, ${latitude}), ${table.trashBins.point})`)
      .limit(1);

    if (!trashBin) {
      [trashBin] = await db
        .insert(table.trashBins)
        .values({
          point: [longitude, latitude],
        })
        .returning();
    }

    const score = calculateTrashScore(trashSpot.category, trashSpot.impact, trashSpot.size);
    await db.insert(table.usersDisposedTrash).values({
      point: [longitude, latitude],
      image: photoData,
      userId: locals.user.id,
      trashSpotId: captureRecord,
      trashBinId: trashBin.id,
      score,
    });

    return json({ message: "Photo processed successfully", score }, { status: 200 });
  } catch (error) {
    console.error("Error processing request:", error);
    return json({ error: "Failed to process the photo" }, { status: 500 });
  }
}
