'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import googleFitService from '@/lib/services/googleFitService';
import { useSearchParams } from 'next/navigation';
import React, { Suspense } from 'react'; // Import Suspense

function TestGoogleFitContent() {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check connection status on component mount
    if (user?.uid) {
      const connected = googleFitService.isConnected();
      setIsConnected(connected);
    }

    // Check for URL parameters that indicate OAuth callback results
    const googleFitConnected = searchParams.get('googleFitConnected');
    const googleFitError = searchParams.get('googleFitError');

    if (googleFitConnected === 'true') {
      setTestResult('Google Fit connected successfully!');
    } else if (googleFitError === 'true') {
      setTestResult('Error connecting to Google Fit. Please try again.');
    }
  }, [user, searchParams]);

  const handleConnect = () => {
    if (!user?.uid) {
      setTestResult('You must be logged in to connect to Google Fit');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Redirect to Google OAuth flow
      const authUrl = googleFitService.getAuthUrl(user.uid);
      window.location.href = authUrl;
    } catch (error) {
      console.error('Error initiating Google Fit auth:', error);
      setTestResult('Error initiating Google Fit authentication');
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    googleFitService.disconnect();
    setIsConnected(false);
    setTestResult('Disconnected from Google Fit');
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Google Fit Integration Test</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Connection Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <p>Status: <span className={isConnected ? 'text-green-500 font-bold' : 'text-red-500 font-bold'}>
              {isConnected ? 'Connected' : 'Not Connected'}
            </span></p>
          </div>
          
          {!isConnected ? (
            <Button 
              onClick={handleConnect} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Connecting...' : 'Connect to Google Fit'}
            </Button>
          ) : (
            <Button 
              onClick={handleDisconnect} 
              variant="destructive"
              className="w-full"
            >
              Disconnect from Google Fit
            </Button>
          )}
        </CardContent>
      </Card>
      
      {testResult && (
        <Card className={testResult.includes('Error') ? 'bg-red-50' : 'bg-green-50'}>
          <CardContent className="pt-6">
            <p className="text-center font-medium">{testResult}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function TestGoogleFit() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TestGoogleFitContent />
    </Suspense>
  );
}