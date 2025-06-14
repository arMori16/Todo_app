
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import axios from './api/asxios.api';

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;
  if (!accessToken && refreshToken) {
    try {
      
      const response = await axios.post('/refresh', { refreshToken }, {
        headers: { Authorization: `Bearer ${refreshToken}` },
      });

      const res = NextResponse.next();
      const sixtyMinutes = 60 * 60;
      const expirationDate = new Date(Date.now() + sixtyMinutes);

      res.cookies.set('accessToken', response.data.access_token, { maxAge: sixtyMinutes,expires:expirationDate });
      res.cookies.set('refreshToken', response.data.refresh_token, { maxAge: 28 * 24 * 60 * 60 });

      return res;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/:path*'], // Apply middleware to /admin and subroutes
};
