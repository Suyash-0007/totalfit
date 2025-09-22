"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Wifi } from "lucide-react";

export function LiveBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Badge variant="destructive" className="flex items-center gap-1 text-xs">
        <motion.div
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Wifi className="h-3 w-3" />
        </motion.div>
        LIVE
      </Badge>
    </motion.div>
  );
}


