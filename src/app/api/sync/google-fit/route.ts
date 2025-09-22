import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';

interface SyncRequestPayload {
  userId?: string;
  startTimeMillis?: number;
  endTimeMillis?: number;
}

// Note: In dev we skip Firebase Admin to avoid bundling it in this route.

export async function POST(request: NextRequest) {
  try {
    // Read optional fields (not strictly needed by backend)
    const { userId, startTimeMillis, endTimeMillis }: SyncRequestPayload = await request.json().catch(() => ({}));
    const now = Date.now();
    const start = startTimeMillis || now - 24 * 60 * 60 * 1000; // Default to last 24 hours
    const end = endTimeMillis || now;
    
    // Delegate to backend to persist sync (backend handles Google tokens if any)
    const backendBase = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendBase) {
      return NextResponse.json({ error: 'BACKEND_API_URL not configured' }, { status: 500 });
    }
    await axios.post(
      `${backendBase}/api/performance/sync`,
      { athleteId: userId, timestamp: new Date().toISOString(), startTimeMillis: start, endTimeMillis: end },
      { headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.BACKEND_API_KEY || '' } }
    );
    return NextResponse.json({
      success: true,
      data: { lastSyncTime: new Date() }
    });
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Error syncing Google Fit data:', axiosError.response?.data || axiosError.message || error);
    
    // Handle specific error types with appropriate status codes
    if (axiosError.message && axiosError.message.includes('Not authenticated with Google Fit')) {
      return NextResponse.json(
        { error: 'Not connected to Google Fit', message: 'Please connect your Google Fit account first.' },
        { status: 401 }
      );
    } else if (axiosError.message && axiosError.message.includes('connection has expired')) {
      return NextResponse.json(
        { error: 'Google Fit connection expired', message: 'Your Google Fit connection has expired. Please reconnect your account.' },
        { status: 401 }
      );
    } else if (axiosError.message && axiosError.message.includes('Rate limit exceeded')) {
      return NextResponse.json(
        { error: 'Rate limit exceeded', message: 'Google Fit API rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    } else if (axiosError.response && axiosError.response.status) {
      // Handle backend API errors
      return NextResponse.json(
        { error: 'Backend API error', message: 'Error saving fitness data to the backend.' },
        { status: axiosError.response.status }
      );
    } else {
      // Generic error handler
      return NextResponse.json(
        { error: 'Failed to sync Google Fit data', message: axiosError.message || 'An unexpected error occurred.' },
        { status: 500 }
      );
    }
  }
}