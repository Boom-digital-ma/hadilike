import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // 1. Protect /superadmin routes (highest level)
  if (request.nextUrl.pathname.startsWith('/superadmin')) {
    if (!user) return NextResponse.redirect(new URL('/admin', request.url));

    // Check if user has super_admin role
    const { data: adminData } = await supabase
        .from('brand_admins')
        .select('role')
        .eq('user_id', user.id)
        .single();

    if (!adminData || adminData.role !== 'super_admin') {
        // Not a super admin, redirect to regular admin
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  }

  // 2. Protect /admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // ... rest of logic stays same but we can refine it
    if (request.nextUrl.pathname === '/admin') {
      if (user) return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      return response;
    }
    if (!user) return NextResponse.redirect(new URL('/admin', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/superadmin/:path*'],
};
