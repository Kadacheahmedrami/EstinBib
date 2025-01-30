import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';




export async function middleware(request: NextRequest) {
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



  // Retrieve the session
  // const session = await getServerSession(authOptions);

  // Block non-logged-in users from accessing /contact-us and /profile
  // if (!session && (pathname.startsWith('/contact-us') || pathname.startsWith('/profile'))) {
  //   url.pathname = '/auth/login'; // Redirect to login if not authenticated
  //   return NextResponse.redirect(url);
  // }

  // Block logged-in users from accessing the /auth (login/registration) routes
  // if (session && pathname.startsWith('/auth')) {
  //   url.pathname = '/'; // Redirect to homepage if already logged in
  //   return NextResponse.redirect(url);
  // }

  // Allow other requests to proceed
  return NextResponse.next();
}

// Configure the routes to which the middleware applies
export const config = {
  matcher: [
    '/login',
    '/home',
    '/contact-us',
    '/profile',
    '/auth/login',  // You can add more auth routes if necessary
    '/auth/register', // Add other auth routes if necessary
  ],
};


