"use client";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { 
  Trophy, 
  Flame, 
  Target, 
  Shield, 
  Zap, 
  Star, 
  Medal,
  Activity,
  Heart
} from "lucide-react";

type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
};

const achievements: Achievement[] = [
  {
    id: "1",
    title: "7-Day Streak",
    description: "Training streak maintained",
    icon: <Flame className="h-5 w-5" />,
    color: "bg-orange-500",
    unlocked: true,
  },
  {
    id: "2",
    title: "10K Steps",
    description: "Daily step goal achieved",
    icon: <Target className="h-5 w-5" />,
    color: "bg-green-500",
    unlocked: true,
  },
  {
    id: "3",
    title: "Low Risk Hero",
    description: "30 days injury-free",
    icon: <Shield className="h-5 w-5" />,
    color: "bg-blue-500",
    unlocked: true,
  },
  {
    id: "4",
    title: "Speed Demon",
    description: "Personal best sprint time",
    icon: <Zap className="h-5 w-5" />,
    color: "bg-yellow-500",
    unlocked: false,
    progress: 75,
    maxProgress: 100,
  },
  {
    id: "5",
    title: "Endurance Master",
    description: "Complete 5K run",
    icon: <Activity className="h-5 w-5" />,
    color: "bg-purple-500",
    unlocked: false,
    progress: 60,
    maxProgress: 100,
  },
  {
    id: "6",
    title: "Heart Champion",
    description: "Optimal heart rate zone",
    icon: <Heart className="h-5 w-5" />,
    color: "bg-red-500",
    unlocked: false,
    progress: 40,
    maxProgress: 100,
  },
];

export function GamificationBadges() {
  return (
    <Card>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="h-5 w-5 text-amber-500" />
          <h3 className="font-semibold">Achievements & Progress</h3>
        </div>
        
        <ScrollArea className="h-32">
          <div className="flex gap-3 pb-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex-shrink-0"
              >
                <div className={`relative w-24 h-24 rounded-lg ${achievement.color} flex flex-col items-center justify-center text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer`}>
                  {achievement.icon}
                  <span className="text-xs font-medium mt-1 text-center leading-tight">
                    {achievement.title}
                  </span>
                  
                  {achievement.unlocked && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="absolute -top-1 -right-1"
                    >
                      <Star className="h-4 w-4 text-yellow-300 fill-current" />
                    </motion.div>
                  )}
                  
                  {!achievement.unlocked && achievement.progress && (
                    <div className="absolute bottom-1 left-1 right-1">
                      <div className="bg-white/20 rounded-full h-1">
                        <div 
                          className="bg-white rounded-full h-1 transition-all duration-500"
                          style={{ width: `${achievement.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
        
        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Medal className="h-4 w-4 text-amber-500" />
            <span className="text-muted-foreground">
              {achievements.filter(a => a.unlocked).length} of {achievements.length} unlocked
            </span>
          </div>
          <Badge variant="outline" className="text-xs">
            Level 3 Athlete
          </Badge>
        </div>
      </div>
    </Card>
  );
}
