import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";
import { eq, sql, sum } from "drizzle-orm";

export async function load({ locals }) {
  const username = locals.user.username;
  let score = 0;
  let uid = 0;
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
    if (item.uname === locals.user.username) uid = item.uid;
  });

  const foundTrash = await db
    .select({ uid: table.trashSpots.userId })
    .from(table.trashSpots)
    .where(eq(uid, table.trashSpots.userId));
  const foundTrashCount = foundTrash.length;

  const disposedTrash = await db
    .select({ uid: table.usersDisposedTrash.userId })
    .from(table.usersDisposedTrash)
    .where(eq(table.usersDisposedTrash.userId, uid));
  const disposedTrashCount = disposedTrash.length;

  const total = await db
    .select({
      uid: table.trashSpots.userId,
      user_score: sum(table.trashSpots.score).as("user_score"),
    })
    .from(table.trashSpots)
    .where(eq(table.trashSpots.userId, uid))
    .groupBy(table.trashSpots.userId);
  const totalPoints = total[0].user_score;

  const foundTrash30 = await db
    .select({ uid: table.trashSpots.userId })
    .from(table.trashSpots)
    .where(eq(uid, table.trashSpots.userId));
  const foundTrash30Count = foundTrash.length;

  const disposed30Trash = await db
    .select({ uid: table.usersDisposedTrash.userId })
    .from(table.usersDisposedTrash)
    .where(eq(table.usersDisposedTrash.userId, uid));
  const disposedTrash30Count = disposedTrash.length;

  console.log("Value: ");
  console.log();

  return {
    user: { name: username, uid: uid, score: score },
    scores: scoresWithUsername,
    found: foundTrashCount,
    disposed: disposedTrashCount,
    score: totalPoints,
  };
}
