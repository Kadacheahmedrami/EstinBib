import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const url = request.nextUrl.clone();

  if (pathname.startsWith('/home') ) {
   
 
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

    if (pathname.startsWith('/login') ) {
  
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