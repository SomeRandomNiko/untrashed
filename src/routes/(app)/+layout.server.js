import { redirect } from "@sveltejs/kit";

export const load = async (event) => {
  if (!event.locals.user) {
    return redirect(302, "/login");
  }

  if (event.url.pathname === "/") {
    return redirect(302, "/home");
  }
  return { user: event.locals.user };
};
