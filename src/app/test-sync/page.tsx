'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import axios, { AxiosError } from 'axios'; // Import AxiosError

interface SyncResponseData {
  lastSyncTime: string;
}

interface SyncResponse {
  success: boolean;
  data: SyncResponseData;
}

export default function TestSync() {
  const { user } = useAuth();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);
  const [syncData, setSyncData] = useState<SyncResponse | null>(null);

  const handleSync = async () => {
    if (!user?.uid) {
      setSyncResult('You must be logged in to sync data');
      return;
    }
    
    setIsSyncing(true);
    setSyncResult(null);
    setSyncData(null);
    
    try {
      // Get Firebase ID token
      const idToken = await user.getIdToken();
      
      // Call our API endpoint to sync data
      const response = await axios.post('/api/sync/google-fit', {
        startTimeMillis: Date.now() - 7 * 24 * 60 * 60 * 1000, // Last 7 days
        endTimeMillis: Date.now()
      }, {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });
      
      setSyncResult('Data synchronized successfully!');
      setSyncData(response.data as SyncResponse);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error syncing data:', axiosError.response?.data || axiosError.message || error);
      setSyncResult(`Error syncing data: ${axiosError.message || 'Unknown error'}`);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Google Fit Sync Test</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Sync Google Fit Data</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Test the synchronization of Google Fit data with our backend.</p>
          
          <Button 
            onClick={handleSync} 
            disabled={isSyncing}
            className="w-full"
          >
            {isSyncing ? 'Syncing...' : 'Sync Now'}
          </Button>
        </CardContent>
      </Card>
      
      {syncResult && (
        <Card className={syncResult.includes('Error') ? 'bg-red-50' : 'bg-green-50'}>
          <CardHeader>
            <CardTitle>Sync Result</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{syncResult}</p>
            
            {syncData && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Synced Data:</h3>
                <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-60">
                  {JSON.stringify(syncData, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}