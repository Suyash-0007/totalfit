# Google Fit Integration Setup Guide

## Overview
This guide will help you set up the Google Fit integration for TotalFit. The integration allows users to connect their Google Fit accounts and sync their fitness data with the TotalFit application.

## Prerequisites
1. A Google Cloud Platform account
2. Firebase project (already set up for TotalFit)

## Step 1: Create a Google Cloud Platform Project
If you don't already have a GCP project linked to your Firebase project:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select your existing Firebase project

## Step 2: Enable the Fitness API
1. In the Google Cloud Console, navigate to "APIs & Services" > "Library"
2. Search for "Fitness API" and select it
3. Click "Enable"

## Step 3: Configure OAuth Consent Screen
1. Go to "APIs & Services" > "OAuth consent screen"
2. Select the appropriate user type (External or Internal)
3. Fill in the required information:
   - App name: TotalFit
   - User support email
   - Developer contact information
4. Click "Save and Continue"
5. Add the following scopes:
   - `https://www.googleapis.com/auth/fitness.activity.read`
   - `https://www.googleapis.com/auth/fitness.heart_rate.read`
   - `https://www.googleapis.com/auth/fitness.location.read`
   - `https://www.googleapis.com/auth/fitness.body.read`
6. Complete the remaining steps and submit for verification if needed

## Step 4: Create OAuth 2.0 Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Select "Web application" as the application type
4. Add the following authorized redirect URIs:
   - `http://localhost:3000/api/auth/google-fit/callback` (for development)
   - `https://your-production-domain.com/api/auth/google-fit/callback` (for production)
5. Click "Create"
6. Note down the Client ID and Client Secret

## Step 5: Configure Environment Variables
1. Copy the `.env.local.example` file to `.env.local`
2. Update the following variables with your credentials:
   ```
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
   NEXT_PUBLIC_GOOGLE_API_KEY=your-google-api-key
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

## Step 6: Firebase Admin SDK Setup
1. Go to your Firebase project settings
2. Navigate to "Service accounts"
3. Click "Generate new private key"
4. Save the JSON file securely
5. Convert the JSON to a string and update the `FIREBASE_SERVICE_ACCOUNT_KEY` in your `.env.local` file

## Testing the Integration
1. Start your development server
2. Navigate to the Google Fit connect component
3. Click "Connect" to initiate the OAuth flow
4. After authorization, test syncing data by clicking "Sync Now"

## Troubleshooting
- If you encounter CORS issues, ensure your redirect URIs are correctly configured
- Check browser console for any errors related to the Google Fit API
- Verify that all required scopes are added to your OAuth consent screen
- Ensure your Firebase service account has the necessary permissions

## Additional Resources
- [Google Fit REST API Documentation](https://developers.google.com/fit/rest/v1/reference)
- [Google OAuth 2.0 for Web Server Applications](https://developers.google.com/identity/protocols/oauth2/web-server)