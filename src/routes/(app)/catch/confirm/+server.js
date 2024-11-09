// src/routes/api/capture/+server.js
import { db } from "$lib/server/db/index.js";
import * as table from "$lib/server/db/schema";
import { confirmTrash } from "$lib/server/openai.js";
import { json } from "@sveltejs/kit";
import { eq, sql } from "drizzle-orm";
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

    await db.insert(table.usersDisposedTrash).values({
      point: [longitude, latitude],
      image: photoData,
      userId: locals.user.id,
      trashSpotId: captureRecord,
      trashBinId: trashBin.id,
    });

    return json({ message: "Photo processed successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error processing request:", error);
    return json({ error: "Failed to process the photo" }, { status: 500 });
  }
}
