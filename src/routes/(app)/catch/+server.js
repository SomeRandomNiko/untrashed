// src/routes/api/capture/+server.js
import { db } from "$lib/server/db/index.js";
import * as table from "$lib/server/db/schema";
import { classifyTrash } from "$lib/server/openai.js";
import { json } from "@sveltejs/kit";

export async function POST({ request, locals }) {
  try {
    const { photoData, latitude, longitude } = await request.json();

    const classification = JSON.parse(await classifyTrash(photoData));

    if (!classification.isTrash) {
      return json({ error: "Image is not trash" }, { status: 400 });
    }

    const { name, description, category, impact, size } = classification.data;
    await db.insert(table.trashSpots).values({
      point: [longitude, latitude],
      image: photoData,
      name,
      description,
      category,
      impact,
      size,
      score: 5,
      userId: locals.user.id,
    });

    return json({ message: "Photo processed successfully", score: 5 }, { status: 200 });
  } catch (error) {
    console.error("Error processing request:", error);
    return json({ error: "Failed to process the photo" }, { status: 500 });
  }
}
