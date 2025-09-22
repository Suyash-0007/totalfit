import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { AxiosError } from 'axios';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const state = searchParams.get('state');
  
  console.log('Google Fit callback received:', { code: code?.substring(0, 10) + '...', error, state });
  
  // We'll set a preservation cookie on the response below
  
  // Handle error case
  if (error) {
    console.error('Error during Google Fit authorization:', error);
    return NextResponse.redirect(new URL('/dashboard?googleFitError=' + encodeURIComponent(error), request.url));
  }
  
  // Handle missing code
  if (!code) {
    console.error('No authorization code received from Google');
    return NextResponse.redirect(new URL('/dashboard?googleFitError=no_code', request.url));
  }
  
  try {
    // Exchange code for tokens on backend server
    const backendBase = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendBase) {
      throw new Error('BACKEND_API_URL not configured');
    }
    const redirectUri = `${request.nextUrl.origin}/api/auth/google-fit/callback`;
    await axios.post(`${backendBase}/api/googlefit/exchange`, {
      code,
      redirectUri,
      state,
    });

    // Redirect with success and set a short-lived cookie to preserve auth during redirect cycles
    const redirectUrl = '/dashboard?googleFitConnected=true&ts=' + Date.now();
    const response = NextResponse.redirect(new URL(redirectUrl, request.url));
    response.cookies.set('auth_preserved', 'true', { maxAge: 3600, path: '/', sameSite: 'lax' });
    response.headers.set('Cache-Control', 'no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    return response;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Error handling Google Fit callback:', axiosError.response?.data || axiosError.message || error);
    const errorMessageContent = 
      typeof axiosError.response?.data === 'object' && axiosError.response?.data !== null
        ? JSON.stringify(axiosError.response.data)
        : String(axiosError.response?.data || axiosError.message || 'unknown_error');
    const errorMsg = encodeURIComponent(errorMessageContent);
    return NextResponse.redirect(new URL('/dashboard?googleFitError=' + errorMsg, request.url));
  }
}