import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const { data: userData } = await supabase.auth.getUser();

  let mfaPending = false;
  if (userData.user) {
    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    mfaPending = aal?.currentLevel === "aal1" && aal?.nextLevel === "aal2";
  }

  const isPanelRoute = request.nextUrl.pathname.startsWith("/panel");
  const isLoginRoute = request.nextUrl.pathname === "/panel/login";

  if (isPanelRoute && !isLoginRoute && (!userData.user || mfaPending)) {
    const url = request.nextUrl.clone();
    url.pathname = "/panel/login";
    return NextResponse.redirect(url);
  }

  if (isLoginRoute && userData.user && !mfaPending) {
    const url = request.nextUrl.clone();
    url.pathname = "/panel";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/panel/:path*"],
};
