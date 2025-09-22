"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Dumbbell, Apple, TrendingUp, Target, Clock, Award, AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import axios from "axios";

type Recommendation = {
  id: string;
  type: "workout" | "nutrition" | "career";
  title: string;
  description: string;
  icon: React.ReactNode;
  priority: "high" | "medium" | "low";
  duration?: string;
};

type AIRecommendationResponse = {
  userId: string;
  summary: string;
  highlights: string[];
  recommendations: string[];
  injuryRisk: {
    percent: number;
    level: string;
    contributors: string[];
  };
};

type UserPerformanceData = {
	steps: number;
	heartRate: number;
	calories: number;
	rpe: number;
	workoutType: string;
	duration: number;
	notes: string;
};

/**
 * Converts AI service recommendations to UI recommendation format
 */
const convertToRecommendations = (aiResponse: AIRecommendationResponse | null): Recommendation[] => {
  // Default recommendations if no AI response
  if (!aiResponse) {
    return [
      {
        id: "1",
        type: "workout",
        title: "HIIT Cardio Session",
        description: "Based on your recent performance, try 20-min high-intensity intervals to boost endurance.",
        icon: <Dumbbell className="h-5 w-5" />,
        priority: "high",
        duration: "20 min",
      },
      {
        id: "2",
        type: "nutrition",
        title: "Post-Workout Protein",
        description: "Consume 25g protein within 30 minutes after training for optimal muscle recovery.",
        icon: <Apple className="h-5 w-5" />,
        priority: "medium",
      },
      {
        id: "3",
        type: "career",
        title: "Leadership Training",
        description: "Consider captaincy development program to enhance team leadership skills.",
        icon: <TrendingUp className="h-5 w-5" />,
        priority: "low",
      },
      {
        id: "4",
        type: "workout",
        title: "Recovery Yoga",
        description: "Gentle 15-minute yoga session to improve flexibility and reduce muscle tension.",
        icon: <Target className="h-5 w-5" />,
        priority: "medium",
        duration: "15 min",
      },
    ];
  }

  // Convert AI recommendations to UI format
  return aiResponse.recommendations.map((rec, index) => {
    // Determine recommendation type based on content
    const type = rec.toLowerCase().includes("workout") || 
                rec.toLowerCase().includes("training") || 
                rec.toLowerCase().includes("exercise") ? "workout" :
                rec.toLowerCase().includes("nutrition") || 
                rec.toLowerCase().includes("diet") || 
                rec.toLowerCase().includes("food") ? "nutrition" : "career";
    
    // Determine priority based on injury risk
    const priority = aiResponse.injuryRisk.level === "High" ? "high" :
                    aiResponse.injuryRisk.level === "Moderate" ? "medium" : "low";
    
    // Determine icon based on type
    const icon = type === "workout" ? <Dumbbell className="h-5 w-5" /> :
                type === "nutrition" ? <Apple className="h-5 w-5" /> :
                <TrendingUp className="h-5 w-5" />;
    
    // Extract duration if mentioned in the recommendation
    const durationMatch = rec.match(/(\d+)\s*min/i);
    const duration = durationMatch ? durationMatch[0] : undefined;
    
    // Create title from recommendation
    const title = rec.split(".")[0];
    const description = rec;
    
    return {
      id: `ai-${index}`,
      type,
      title,
      description,
      icon,
      priority,
      duration
    };
  });
};

const typeColors = {
  workout: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  nutrition: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  career: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
};

const priorityColors = {
  high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  low: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
};

interface AIRecommendationsProps {
  userData?: UserPerformanceData;
}

export function AIRecommendations({ userData }: AIRecommendationsProps) {
  const [aiResponse, setAiResponse] = useState<AIRecommendationResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Only fetch recommendations if we have user data
    if (userData) {
      fetchRecommendations();
    }
  }, [userData]);
  
  const fetchRecommendations = async () => {
    if (!userData) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Use a mock user ID for demo purposes
      const userId = localStorage.getItem('userId') || 'user-' + Math.random().toString(36).substring(2, 9);
      
      // Store the user ID for future use
      if (!localStorage.getItem('userId')) {
        localStorage.setItem('userId', userId);
      }
      
      const response = await axios.post('/api/recommendations', {
        userId,
        userData
      });
      
      setAiResponse(response.data);
    } catch (err) {
      console.error('Error fetching AI recommendations:', err);
      setError('Failed to fetch recommendations. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const recommendations = convertToRecommendations(aiResponse);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-amber-500" />
          AI Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center p-6">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2">Generating personalized recommendations...</span>
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <>
            {aiResponse && (
              <div className="mb-4">
                <p className="text-sm font-medium">Analysis Summary</p>
                <p className="text-sm text-muted-foreground">{aiResponse.summary}</p>
                
                {aiResponse.injuryRisk && (
                  <div className="mt-2">
                    <Badge 
                      className={`
                        ${aiResponse.injuryRisk.level === 'High' ? 'bg-red-100 text-red-800' : 
                          aiResponse.injuryRisk.level === 'Moderate' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-green-100 text-green-800'}
                      `}
                    >
                      {aiResponse.injuryRisk.level} Risk ({aiResponse.injuryRisk.percent}%)
                    </Badge>
                  </div>
                )}
              </div>
            )}
            
            {recommendations.map((rec, index) => (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="rounded-lg border p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {rec.icon}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{rec.title}</h4>
                        <Badge className={`text-xs ${typeColors[rec.type]}`}>
                          {rec.type}
                        </Badge>
                        <Badge className={`text-xs ${priorityColors[rec.priority]}`}>
                          {rec.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{rec.description}</p>
                      {rec.duration && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {rec.duration}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </>
        )}
      </CardContent>
    </Card>
  );
}
