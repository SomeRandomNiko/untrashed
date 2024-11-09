import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";
import { eq, sum } from "drizzle-orm";

export async function load({ locals }) {
  const trashs = db
    .select({
      uid: table.trashSpots.userId,
      user_score: sum(table.trashSpots.score).as("user_score"),
    })
    .from(table.trashSpots)
    .groupBy(table.trashSpots.userId)
    .as("user_score");
  const scoresWithUsername = await db
    .select({ uname: table.users.username, uid: table.users.id, score: trashs.user_score })
    .from(trashs)
    .rightJoin(table.users, eq(table.users.id, trashs.uid));

  scoresWithUsername.forEach((item) => {
    if (item.score === null) item.score = 0;
  });

  return {
    username: locals.user.username,
    scores: scoresWithUsername,
  };
}
