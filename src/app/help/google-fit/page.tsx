'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import googleFitService from '@/lib/services/googleFitService';
import { useState, useEffect } from 'react';

export default function GoogleFitHelp() {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  
  useEffect(() => {
    if (user?.uid) {
      const connected = googleFitService.isConnected();
      setIsConnected(connected);
    }
  }, [user]);

  const handleConnect = () => {
    if (!user?.uid) return;
    const authUrl = googleFitService.getAuthUrl(user.uid);
    window.location.href = authUrl;
  };

  return (
    <div className="container mx-auto py-10 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">Google Fit Integration</h1>
      <p className="text-muted-foreground mb-8">Learn how to connect and sync your Google Fit data with TotalFit</p>
      
      {user ? (
        <Card className="mb-8 border-2 border-blue-200">
          <CardHeader className="bg-blue-50">
            <CardTitle className="flex items-center gap-2">
              <span>Connection Status</span>
              {isConnected ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-amber-500" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {isConnected ? (
              <div>
                <p className="text-green-600 font-medium mb-4">Your Google Fit account is connected!</p>
                <p className="mb-4">Your fitness data will automatically sync with TotalFit. You can manually sync anytime from your dashboard.</p>
              </div>
            ) : (
              <div>
                <p className="text-amber-600 font-medium mb-4">Your Google Fit account is not connected</p>
                <p className="mb-4">Connect your Google Fit account to automatically sync your fitness data with TotalFit.</p>
                <Button onClick={handleConnect} className="w-full">
                  Connect Google Fit
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-8 border-2 border-amber-200">
          <CardContent className="pt-6">
            <p className="text-amber-600 font-medium mb-4">You need to sign in first</p>
            <p className="mb-4">Please sign in to your TotalFit account to connect with Google Fit.</p>
            <Link href="/login">
              <Button className="w-full">Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      )}
      
      <h2 className="text-2xl font-bold mt-10 mb-4">How to Connect Google Fit</h2>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Sign in to TotalFit</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Make sure you&apos;re signed in to your TotalFit account before connecting to Google Fit.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Step 2: Navigate to Google Fit Connect</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Go to your profile settings or dashboard and find the Google Fit Connect section.</p>
            <Link href="/dashboard">
              <Button variant="outline" className="flex items-center gap-2">
                Go to Dashboard <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Step 3: Authorize TotalFit</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Click the &quot;Connect&quot; button and follow the Google authorization prompts. You&apos;ll need to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Sign in to your Google account</li>
              <li>Review and accept the permissions TotalFit is requesting</li>
              <li>Confirm the connection</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Step 4: Start Syncing Data</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Once connected, your Google Fit data will automatically sync with TotalFit. You can also manually sync anytime from your dashboard.</p>
          </CardContent>
        </Card>
      </div>
      
      <h2 className="text-2xl font-bold mt-10 mb-4">Frequently Asked Questions</h2>
      
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>What data is synced from Google Fit?</CardTitle>
          </CardHeader>
          <CardContent>
            <p>TotalFit syncs the following data from your Google Fit account:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Step count</li>
              <li>Heart rate measurements</li>
              <li>Calories burned</li>
              <li>Distance traveled</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>How often is my data synced?</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Your data is automatically synced once per day. You can also manually sync anytime from your dashboard.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>How do I disconnect Google Fit?</CardTitle>
          </CardHeader>
          <CardContent>
            <p>You can disconnect your Google Fit account at any time from your profile settings or the Google Fit Connect section in your dashboard.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Is my data secure?</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Yes, we take your privacy seriously. Your fitness data is encrypted and securely stored. We never share your personal data with third parties without your explicit consent.</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-10 text-center">
        <p className="text-muted-foreground mb-4">Still have questions about Google Fit integration?</p>
        <Link href="/help/contact">
          <Button variant="outline">Contact Support</Button>
        </Link>
      </div>
    </div>
  );
}