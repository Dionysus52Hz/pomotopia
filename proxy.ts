import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

const PUBLIC_ROUTES = ["/faq-tutorial", "/introduce"];
const AUTH_ROUTES = ["/signin", "/signup"];
const ONBOARDING_ROUTE = "/onboarding";

export async function proxy(request: NextRequest) {
   const { supabaseResponse, data } = await updateSession(request);
   const { pathname } = request.nextUrl;

   const isPublicRoute = PUBLIC_ROUTES.some((route) =>
      pathname.startsWith(route)
   );
   const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
   const isOnboardingRoute = pathname.startsWith(ONBOARDING_ROUTE);

   if (isPublicRoute) {
      return supabaseResponse;
   }

   const hasSession = data !== null;
   const isOnboardingCompleted =
      data?.claims.user_metadata?.onboarding_completed === true;

   if (!hasSession) {
      if (!isAuthRoute) {
         return NextResponse.redirect(new URL("/signin", request.url));
      }

      return supabaseResponse;
   }

   if (hasSession && !isOnboardingCompleted) {
      if (!isOnboardingRoute) {
         return NextResponse.redirect(new URL("/onboarding", request.url));
      }

      return supabaseResponse;
   }

   if (hasSession && isOnboardingCompleted) {
      if (isAuthRoute || isOnboardingRoute) {
         const referer = request.headers.get("referer");
         if (referer) {
            return NextResponse.redirect(new URL(referer, request.url));
         }
         return NextResponse.redirect(new URL("/", request.url));
      }
   }

   return supabaseResponse;
}

export const config = {
   matcher: ["/((?!_next/static|_next/image|favicon.ico|icons|images|api).*)"],
};
