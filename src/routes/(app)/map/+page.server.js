import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";
import { notInArray } from "drizzle-orm";
export async function load() {
  const trashSpots = await db
    .select()
    .from(table.trashSpots)
    .where(
      notInArray(
        table.trashSpots.id,
        db
          .select({ trashSpotId: table.usersDisposedTrash.trashSpotId })
          .from(table.usersDisposedTrash),
      ),
    );

  const features = trashSpots.map((ts) => {
    const { point, image, ...properties } = ts;
    return {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: ts.point,
      },
      properties: properties,
    };
  });

  const featureCollection = {
    type: "FeatureCollection",
    features,
  };

  return {
    trashSpots: featureCollection,
  };
}
