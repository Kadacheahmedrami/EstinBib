import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the URL starts with `/login`
  if (pathname.startsWith('/login')) {
    // Redirect to `/auth/login`
    const url = request.nextUrl.clone();
    url.pathname = '/auth/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}


// export const config = {
//   matcher: [

//     '/',
//     '/test',
//     '/notification', 
//     '/appointments', 
//     '/historique', 
//     '/profile', 
//     '/search', 
//     '/chat',
    
//     '/pages/:path*'
//   ]
// }