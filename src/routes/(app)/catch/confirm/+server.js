// src/routes/api/capture/+server.js
import { json } from "@sveltejs/kit";

export async function POST({ request, locals }) {
  try {
    const { photoData, latitude, longitude } = await request.json();

    return json({ message: "Photo processed successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error processing request:", error);
    return json({ error: "Failed to process the photo" }, { status: 500 });
  }
}
