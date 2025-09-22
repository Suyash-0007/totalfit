"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import googleFitService from "@/lib/services/googleFitService";
import axios, { AxiosError } from "axios";
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from "@/components/ui/use-toast";

interface BackendErrorResponse {
  message?: string;
  error?: string;
}

export function GoogleFitConnect() {
  const { user } = useAuth();
  const [connected, setConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  // Check connection status on component mount and URL parameters
  useEffect(() => {
    // Check URL parameters for connection status
    const googleFitConnected = searchParams.get('googleFitConnected') === 'true';
    const googleFitError = searchParams.get('googleFitError');
    
    if (googleFitConnected) {
      setConnected(true);
      toast({
        title: "Success!",
        description: "Your Google Fit account has been connected successfully.",
        variant: "default",
      });
      
      // Clear URL parameters
      const url = new URL(window.location.href);
      url.searchParams.delete('googleFitConnected');
      window.history.replaceState({}, '', url);
      
      // Trigger initial sync
      setTimeout(() => handleSync(), 1000);
    } else if (googleFitError) {
      setSyncError(`Connection failed: ${googleFitError}`);
      toast({
        title: "Connection Failed",
        description: `Failed to connect to Google Fit: ${googleFitError}`,
        variant: "destructive",
      });
      
      // Clear URL parameters
      const url = new URL(window.location.href);
      url.searchParams.delete('googleFitError');
      window.history.replaceState({}, '', url);
    } else if (user?.uid) {
      // Check if already connected
      const isConnected = googleFitService.isConnected();
      setConnected(isConnected);
    }
  }, [user, searchParams]);

  const handleConnect = () => {
    if (!user?.uid) return;
    
    setIsLoading(true);
    setSyncError(null);
    
    // Store user authentication state before redirecting
    if (user) {
      // Save user ID to session storage to maintain auth state
      sessionStorage.setItem('auth_user_id', user.uid);
      
      // Store auth token if available
      user.getIdToken().then(token => {
        sessionStorage.setItem('auth_token', token);
      });
    }
    
    // Redirect to Google OAuth flow with state=userId
    const authUrl = googleFitService.getAuthUrl(user.uid);
    window.location.href = authUrl;
  };

  const handleSync = async () => {
    if (!user?.uid) return;
    
    setIsSyncing(true);
    setSyncError(null);
    
    try {
      // Get Firebase ID token
      const idToken = await user.getIdToken();
      
      // Call our API endpoint to sync data
      const response = await axios.post('/api/sync/google-fit', {
        // Add userId to the body for the API route to use
        userId: user.uid,
        startTimeMillis: Date.now() - 7 * 24 * 60 * 60 * 1000, // Last 7 days
        endTimeMillis: Date.now(),
      }, {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });
      
      if (response.data.success) {
        setLastSyncTime(new Date());
      } else {
        setSyncError('Failed to sync data');
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error syncing Google Fit data:', axiosError.response?.data || axiosError.message || error);
      
      // Display more specific error messages based on the error response
      if (axiosError.response) {
        const { status, data } = axiosError.response;
        const errorData = data as BackendErrorResponse; // Type assertion
        
        if (status === 401) {
          setSyncError(errorData.message || 'Authentication error. Please reconnect your Google Fit account.');
          // Automatically redirect to reconnect after a delay
          setTimeout(() => {
            handleConnect();
          }, 3000);
        } else if (status === 429) {
          setSyncError('Rate limit exceeded. Please try again in a few minutes.');
        } else {
          setSyncError(errorData.message || 'Error syncing data. Please try again.');
        }
      } else if (axiosError.request) {
        setSyncError('Network error. Please check your internet connection.');
      } else {
        setSyncError('Error syncing data. Please try again.');
      }
    } finally {
      setIsSyncing(false);
    }
  };

  if (!user?.uid) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-2 border-dashed border-muted-foreground/25">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Activity className="h-5 w-5" />
            Google Fit Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!connected ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Connect your Google Fit account to automatically sync your health data including steps, 
                heart rate, and calories burned from your smartwatch.
              </p>
              <Button 
                onClick={handleConnect} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Activity className="mr-2 h-4 w-4" />
                    Connect Google Fit
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Connected</span>
                  <Badge variant="secondary" className="text-xs">
                    Active
                  </Badge>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground">
                Your Google Fit data is being synced automatically. Click below to manually sync now.
                {lastSyncTime && (
                  <span className="block mt-1 text-xs">
                    Last synced: {lastSyncTime.toLocaleString()}
                  </span>
                )}
              </p>
              
              {syncError && (
                <div className="flex items-center gap-2 text-red-500 text-sm mt-1">
                  <AlertCircle className="h-4 w-4" />
                  <span>{syncError}</span>
                </div>
              )}
              
              <div className="space-y-2">
                <Button 
                  onClick={handleSync} 
                  disabled={isSyncing}
                  variant="outline"
                  className="w-full"
                >
                  {isSyncing ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Sync Now
                    </>
                  )}
                </Button>
                
                <div className="text-center">
                  <a href="/help/google-fit" className="text-xs text-blue-500 hover:underline">
                    Learn more about Google Fit integration
                  </a>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
