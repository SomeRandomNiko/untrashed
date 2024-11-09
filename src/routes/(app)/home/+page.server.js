import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";
import { eq, sql, sum } from "drizzle-orm";

export async function load({ locals }) {
  const username = locals.user.username;
  let score = 0;
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
    .rightJoin(table.users, eq(table.users.id, trashs.uid))
    .orderBy(sql`${trashs.user_score} desc nulls last`);

  scoresWithUsername.forEach((item) => {
    if (item.score === null) item.score = 0;
    if (item.uname === locals.user.username) score = item.score;
  });

  return {
    user: { name: username, score: score },
    scores: scoresWithUsername,
  };
}
