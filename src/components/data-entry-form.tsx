"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

type PerformanceData = {
  steps: number;
  heartRate: number;
  calories: number;
  rpe: number;
  workoutType: string;
  duration: number;
  notes: string;
};

export function DataEntryForm({ onDataSaved }: { onDataSaved?: () => void }) {
  const { user } = useAuth();
  const [data, setData] = useState<PerformanceData>({
    steps: 0,
    heartRate: 0,
    calories: 0,
    rpe: 0,
    workoutType: "",
    duration: 0,
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // Check if user is authenticated
    if (!user) {
      alert("Please log in to save your performance data.");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Save to localStorage to simulate data persistence
    localStorage.setItem("userPerformanceData", JSON.stringify(data));
    
    // Reset form
    setData({
      steps: 0,
      heartRate: 0,
      calories: 0,
      rpe: 0,
      workoutType: "",
      duration: 0,
      notes: "",
    });
    
    setIsSubmitting(false);
    alert("Data saved! AI recommendations will update based on your input.");
    
    // Call the callback to notify parent component that data was saved
    if (onDataSaved) {
      onDataSaved();
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-indigo-600" />
            Log Performance Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="steps">Steps</Label>
                <Input
                  id="steps"
                  type="number"
                  placeholder="e.g., 8500"
                  value={data.steps || ""}
                  onChange={(e) => setData({ ...data, steps: parseInt(e.target.value) || 0 })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="heartRate">Heart Rate (BPM)</Label>
                <Input
                  id="heartRate"
                  type="number"
                  placeholder="e.g., 65"
                  value={data.heartRate || ""}
                  onChange={(e) => setData({ ...data, heartRate: parseInt(e.target.value) || 0 })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="calories">Calories Burned</Label>
                <Input
                  id="calories"
                  type="number"
                  placeholder="e.g., 450"
                  value={data.calories || ""}
                  onChange={(e) => setData({ ...data, calories: parseInt(e.target.value) || 0 })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rpe">RPE (Rate of Perceived Exertion)</Label>
                <Select value={data.rpe.toString()} onValueChange={(value) => setData({ ...data, rpe: parseInt(value) })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select RPE (1-10)" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                      <SelectItem key={value} value={value.toString()}>
                        {value} - {value <= 3 ? "Very Light" : value <= 5 ? "Light" : value <= 7 ? "Moderate" : value <= 9 ? "Hard" : "Maximum"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="workoutType">Workout Type</Label>
                <Select value={data.workoutType} onValueChange={(value) => setData({ ...data, workoutType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select workout type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cardio">Cardio</SelectItem>
                    <SelectItem value="strength">Strength Training</SelectItem>
                    <SelectItem value="flexibility">Flexibility/Yoga</SelectItem>
                    <SelectItem value="sports">Sports Training</SelectItem>
                    <SelectItem value="recovery">Recovery</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="e.g., 45"
                  value={data.duration || ""}
                  onChange={(e) => setData({ ...data, duration: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="How did you feel? Any observations..."
                value={data.notes}
                onChange={(e) => setData({ ...data, notes: e.target.value })}
                rows={3}
              />
            </div>
            
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Saving..." : "Save Performance Data"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
