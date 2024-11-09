import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";
import { notInArray, sql } from "drizzle-orm";
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

  const events = await db.execute(
    sql`
      SELECT
        ST_AsGeoJSON(ST_Buffer(ST_MakePoint(11.16, 46.67)::geography, 2000))::jsonb as geometry,
        'Make Merano clean again' as name,
        'The situation of the city center is getting worse. The waste is increasing and the trash is not being collected. We need to take action to clean the city.' as description
      `,
  );

  return {
    trashSpots: featureCollection,
    events: {
      type: "FeatureCollection",
      features: events.map((e) => ({
        type: "Feature",
        geometry: e.geometry,
        properties: {
          name: e.name,
          description: e.description,
        },
      })),
    },
  };
}
