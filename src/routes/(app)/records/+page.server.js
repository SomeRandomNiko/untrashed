import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";
import { getTableColumns, notInArray, sql } from "drizzle-orm";

export async function load({ params }) {
  const trashSpots = await db
    .select({
      ...getTableColumns(table.trashSpots),
      distance:
        sql`ST_Distance(ST_MakePoint(11.555, 46.555)::geography, ${table.trashSpots.point}::geography)`.as(
          "distance",
        ),
    })
    .from(table.trashSpots)
    .where(
      notInArray(
        table.trashSpots.id,
        db
          .select({ trashSpotId: table.usersDisposedTrash.trashSpotId })
          .from(table.usersDisposedTrash),
      ),
    )
    .orderBy(
      sql`ST_Distance(ST_MakePoint(11.555, 46.555)::geography, ${table.trashSpots.point}::geography)`,
    )
    .limit(10);

  return {
    records: trashSpots,
  };
}
