import axios from 'axios';

// Google Fit API scopes we need access to
const SCOPES = [
  'https://www.googleapis.com/auth/fitness.activity.read',
  'https://www.googleapis.com/auth/fitness.heart_rate.read',
  'https://www.googleapis.com/auth/fitness.body.read',
  'https://www.googleapis.com/auth/fitness.location.read'
];

// Configuration from environment variables (client-id can be public)
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
const REDIRECT_URI = typeof window !== 'undefined' ? `${window.location.origin}/api/auth/google-fit/callback` : '';

// Data types
export interface GoogleFitData {
  steps: number;
  heartRate: number;
  calories: number;
  distance: number;
  lastSyncTime: Date;
}

export interface GoogleFitAuthResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
}

// Google Fit API response types
export interface GoogleFitApiResponse {
  bucket: Array<{
    startTimeMillis: string;
    endTimeMillis: string;
    dataset: Array<{
      dataSourceId: string;
      point: Array<{
        startTimeNanos: string;
        endTimeNanos: string;
        value: Array<{
          intVal?: number;
          fpVal?: number;
        }>
      }>
    }>
  }>;
}

class GoogleFitService {
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;
  private refreshToken: string | null = null;

  constructor() {
    // Try to load tokens from localStorage on initialization
    if (typeof window !== 'undefined') {
      this.loadTokensFromStorage();
    }
  }

  private loadTokensFromStorage() {
    try {
      const tokens = localStorage.getItem('googleFitTokens');
      if (tokens) {
        const { accessToken, tokenExpiry, refreshToken } = JSON.parse(tokens);
        this.accessToken = accessToken;
        this.tokenExpiry = new Date(tokenExpiry);
        this.refreshToken = refreshToken;
      }
    } catch (error) {
      console.error('Error loading Google Fit tokens from storage:', error);
    }
  }

  private saveTokensToStorage() {
    try {
      if (this.accessToken && this.tokenExpiry && this.refreshToken) {
        localStorage.setItem('googleFitTokens', JSON.stringify({
          accessToken: this.accessToken,
          tokenExpiry: this.tokenExpiry.toISOString(),
          refreshToken: this.refreshToken
        }));
      }
    } catch (error) {
      console.error('Error saving Google Fit tokens to storage:', error);
    }
  }

  private clearTokensFromStorage() {
    try {
      localStorage.removeItem('googleFitTokens');
      this.accessToken = null;
      this.tokenExpiry = null;
      this.refreshToken = null;
    } catch (error) {
      console.error('Error clearing Google Fit tokens from storage:', error);
    }
  }

  /**
   * Check if the user is currently connected to Google Fit
   */
  isConnected(): boolean {
    // Check localStorage for connection status (client-side)
    if (typeof window !== 'undefined') {
      const connected = localStorage.getItem('googlefit_connected') === 'true';
      const accessToken = localStorage.getItem('googlefit_access_token');
      return connected && !!accessToken;
    }
    // Fallback to instance variable (server-side)
    return !!this.accessToken && !!this.tokenExpiry && new Date() < this.tokenExpiry;
  }

  /**
   * Get the authorization URL for Google Fit
   */
  getAuthUrl(userId: string): string {
    // Store the current auth state before redirecting
    if (typeof window !== 'undefined') {
      // Save the current path to return to after auth
      localStorage.setItem('googleFitAuthRedirect', window.location.pathname);
    }
    
    const baseUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      response_type: 'code',
      scope: SCOPES.join(' '),
      access_type: 'offline',
      prompt: 'consent',
      // Include the userId in state so the server can associate tokens
      state: userId
    });

    return `${baseUrl}?${params.toString()}`;
  }

  /**
   * Handle the OAuth callback and exchange code for tokens
   */
  async handleAuthCallback(_code: string): Promise<boolean> { return false; }

  /**
   * Refresh the access token using the refresh token
   */
  private async refreshAccessToken(): Promise<boolean> { return false; }

  /**
   * Ensure we have a valid access token
   */
  private async ensureValidToken(): Promise<boolean> {
    if (!this.accessToken || !this.tokenExpiry) {
      return false;
    }

    // If token is expired or about to expire in the next 5 minutes
    if (new Date() > new Date(this.tokenExpiry.getTime() - 5 * 60 * 1000)) {
      return await this.refreshAccessToken();
    }

    return true;
  }

  /**
   * Disconnect from Google Fit
   */
  disconnect(): void {
    this.clearTokensFromStorage();
  }

  /**
   * Fetch fitness data from Google Fit API with rate limit handling
   */
  async fetchFitnessData(_startTimeMillis: number, _endTimeMillis: number): Promise<GoogleFitData | null> { throw new Error('Not supported in client'); }

  /**
   * Extract steps count from Google Fit API response
   * @param data The Google Fit API response data
   * @returns The total number of steps
   */
  private extractSteps(data: GoogleFitApiResponse): number {
    try {
      if (!data.bucket || data.bucket.length === 0) return 0;
      
      let totalSteps = 0;
      for (const bucket of data.bucket) {
        if (bucket.dataset && bucket.dataset.length > 0) {
          for (const dataset of bucket.dataset) {
            if (dataset.point && dataset.point.length > 0) {
              for (const point of dataset.point) {
                if (point.value && point.value.length > 0) {
                  totalSteps += point.value[0].intVal || 0;
                }
              }
            }
          }
        }
      }
      
      return totalSteps;
    } catch (error) {
      console.error('Error extracting steps data:', error);
      return 0;
    }
  }

  /**
   * Extract heart rate from Google Fit API response
   * @param data The Google Fit API response data
   * @returns The average heart rate in BPM
   */
  private extractHeartRate(data: GoogleFitApiResponse): number {
    try {
      if (!data.bucket || data.bucket.length === 0) return 0;
      
      let totalHeartRate = 0;
      let count = 0;
      
      for (const bucket of data.bucket) {
        if (bucket.dataset && bucket.dataset.length > 0) {
          for (const dataset of bucket.dataset) {
            if (dataset.point && dataset.point.length > 0) {
              for (const point of dataset.point) {
                if (point.value && point.value.length > 0) {
                  totalHeartRate += point.value[0].fpVal || 0;
                  count++;
                }
              }
            }
          }
        }
      }
      
      return count > 0 ? Math.round(totalHeartRate / count) : 0;
    } catch (error) {
      console.error('Error extracting heart rate data:', error);
      return 0;
    }
  }

  /**
   * Extract calories from Google Fit API response
   * @param data The Google Fit API response data
   * @returns The total calories burned
   */
  private extractCalories(data: GoogleFitApiResponse): number {
    try {
      if (!data.bucket || data.bucket.length === 0) return 0;
      
      let totalCalories = 0;
      
      for (const bucket of data.bucket) {
        if (bucket.dataset && bucket.dataset.length > 0) {
          for (const dataset of bucket.dataset) {
            if (dataset.point && dataset.point.length > 0) {
              for (const point of dataset.point) {
                if (point.value && point.value.length > 0) {
                  totalCalories += point.value[0].fpVal || 0;
                }
              }
            }
          }
        }
      }
      
      return Math.round(totalCalories);
    } catch (error) {
      console.error('Error extracting calories data:', error);
      return 0;
    }
  }

  /**
   * Extract distance from Google Fit API response
   * @param data The Google Fit API response data
   * @returns The total distance in kilometers
   */
  private extractDistance(data: GoogleFitApiResponse): number {
    try {
      if (!data.bucket || data.bucket.length === 0) return 0;
      
      let totalDistance = 0;
      
      for (const bucket of data.bucket) {
        if (bucket.dataset && bucket.dataset.length > 0) {
          for (const dataset of bucket.dataset) {
            if (dataset.point && dataset.point.length > 0) {
              for (const point of dataset.point) {
                if (point.value && point.value.length > 0) {
                  totalDistance += point.value[0].fpVal || 0;
                }
              }
            }
          }
        }
      }
      
      // Convert meters to kilometers and round to 2 decimal places
      return Math.round(totalDistance / 10) / 100;
    } catch (error) {
      console.error('Error extracting distance data:', error);
      return 0;
    }
  }
}

// Create a singleton instance
const googleFitService = new GoogleFitService();
export default googleFitService;