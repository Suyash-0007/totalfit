"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GoogleButton } from "@/components/ui/google-button";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";
// Removed: import { FirebaseError } from "firebase/auth"; // Import FirebaseError

const features = [
  "Personalized AI workout recommendations",
  "Track your fitness progress",
  "Connect with Google Fit",
  "Get insights from your performance data",
  "Join a community of fitness enthusiasts",
];

export default function GetStartedPage() {
  const router = useRouter();
  const { signInWithGoogle } = useAuth();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  
  async function handleGoogleSignIn() {
    setError("");
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      router.push("/dashboard");
    } catch (err) { // eslint-disable-line @typescript-eslint/no-explicit-any
      setError((err as Error).message || "Failed to sign in with Google");
      setGoogleLoading(false);
    }
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left column - Content */}
          <div>
            <motion.h1 
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Start Your Fitness Journey Today
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-600 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Join TotalFit to track your workouts, get personalized recommendations, and achieve your fitness goals.
            </motion.p>
            
            <motion.div 
              className="space-y-3 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {features.map((feature, index) => (
                <motion.div 
                  key={index} 
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                >
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>{feature}</span>
                </motion.div>
              ))}
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <GoogleButton 
                onClick={handleGoogleSignIn} 
                loading={googleLoading} 
                className="mb-4 w-full md:w-auto"
              />
              
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
                  {error}
                </div>
              )}
              
              <div className="mt-4 flex items-center gap-4">
                <span className="text-gray-500">Already have an account?</span>
                <Link href="/login">
                  <Button variant="outline">Sign In</Button>
                </Link>
              </div>
            </motion.div>
          </div>
          
          {/* Right column - Cards */}
          <div className="relative h-[500px]">
            <motion.div
              className="absolute top-0 right-0"
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: -5 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="w-64 h-72 bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xl">
                <CardContent className="p-6 flex flex-col justify-between h-full">
                  <div>
                    <h3 className="text-xl font-bold mb-2">AI Recommendations</h3>
                    <p className="text-blue-100">Get personalized workout suggestions based on your performance.</p>
                  </div>
                  <Button variant="secondary" className="mt-4">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              className="absolute top-32 left-12"
              initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
              animate={{ opacity: 1, scale: 1, rotate: 5 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card className="w-64 h-72 bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-xl">
                <CardContent className="p-6 flex flex-col justify-between h-full">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Track Progress</h3>
                    <p className="text-green-100">Monitor your fitness journey with detailed analytics and insights.</p>
                  </div>
                  <Button variant="secondary" className="mt-4">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              className="absolute bottom-0 right-20"
              initial={{ opacity: 0, scale: 0.8, rotate: -3 }}
              animate={{ opacity: 1, scale: 1, rotate: -3 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <Card className="w-64 h-72 bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-xl">
                <CardContent className="p-6 flex flex-col justify-between h-full">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Google Fit</h3>
                    <p className="text-purple-100">Seamlessly connect with Google Fit to import your activity data.</p>
                  </div>
                  <Button variant="secondary" className="mt-4">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}




