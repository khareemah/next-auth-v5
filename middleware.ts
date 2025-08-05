export { auth as middleware } from "@/auth";

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|signup|forgot-password|reset-password|verify-otp|reset-password-success|favicon|assets|fonts|svg|images|serviceWorker).*)",
  ],
};
