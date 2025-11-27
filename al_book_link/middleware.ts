import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in",
  "/sign-up",
]);

export default clerkMiddleware(async (auth, req) => {
  // If user just signed up → send to complete-profile
  if (
    req.nextUrl.pathname === "/sign-up" &&
    req.nextUrl.searchParams.get("redirectedFrom") === "signup"
  ) {
    return Response.redirect(new URL("/complete-profile", req.url));
  }

  // If signed-in user tries sign-in or sign-up → send to home
  if (auth.userId && (req.nextUrl.pathname === "/sign-in" || req.nextUrl.pathname === "/sign-up")) {
    return Response.redirect(new URL("/", req.url));
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)"],
};
