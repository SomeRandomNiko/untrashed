import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";
import { and, eq, getTableColumns, notInArray, sql } from "drizzle-orm";

export async function load({ params, locals }) {
  const allTrashSpots = await db
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

  const ownTrashSpots = await db
    .select({
      ...getTableColumns(table.trashSpots),
      distance:
        sql`ST_Distance(ST_MakePoint(11.555, 46.555)::geography, ${table.trashSpots.point}::geography)`.as(
          "distance",
        ),
    })
    .from(table.trashSpots)
    .where(
      and(
        eq(table.trashSpots.userId, locals.user.id),
        notInArray(
          table.trashSpots.id,
          db
            .select({ trashSpotId: table.usersDisposedTrash.trashSpotId })
            .from(table.usersDisposedTrash),
        ),
      ),
    )
    .orderBy(
      sql`ST_Distance(ST_MakePoint(11.555, 46.555)::geography, ${table.trashSpots.point}::geography)`,
    )
    .limit(10);

  return {
    allTrashSpots,
    ownTrashSpots,
  };
}
