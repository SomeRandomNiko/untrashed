import { userLocation } from "$lib/server/userLocation.js";

export async function load({ url }) {
  const lat = url.searchParams.get("lat");
  const long = url.searchParams.get("long");

  userLocation.set([lat, long]);
}
