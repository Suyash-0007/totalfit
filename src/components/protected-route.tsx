"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Check if we're in the middle of Google Fit auth flow
    const authUserId = sessionStorage.getItem('auth_user_id');
    const authPreserved = document.cookie.includes('auth_preserved=true');
    const isGoogleFitRedirect = window.location.pathname.includes('/dashboard') && 
                               (window.location.search.includes('googleFitConnected') || 
                                window.location.search.includes('googleFitError'));
    
    // Only redirect to login if we're not in the middle of auth flow
    if (!user && !authUserId && !authPreserved && !isGoogleFitRedirect) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}


