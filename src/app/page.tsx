"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Stethoscope, Briefcase, Wallet, Sparkles, Shield, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="space-y-24">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-xl border bg-background px-6 py-20 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-gray-50" />
        <div className="absolute -left-24 -top-24 h-72 w-72 animate-pulse rounded-full bg-blue-100/50 blur-3xl" />
        <div className="absolute -bottom-32 -right-24 h-96 w-96 animate-pulse rounded-full bg-gray-100/50 blur-3xl" />
        <div className="relative mx-auto max-w-4xl text-center">
          <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Elevate Athlete Performance with TotalFit
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }} className="mt-4 text-pretty text-lg/7 text-muted-foreground">
            Track performance, prevent injuries, plan careers, and manage finances — all in one platform.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.1 }} className="mt-8 flex items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/get-started">Get Started</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/login">Login</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Purpose */}
      <section className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-blue-600 ring-1 ring-blue-200">
            <Sparkles className="h-4 w-4" />
            Purpose
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground">Built for athlete success</h2>
          <p className="mt-2 text-muted-foreground">Four pillars that power smarter decisions.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Performance", desc: "Training load, trends, and insights.", icon: Activity, color: "blue" },
            { title: "Injuries", desc: "Risk flags and recovery tracking.", icon: Stethoscope, color: "red" },
            { title: "Career", desc: "Milestones, goals, and progression.", icon: Briefcase, color: "green" },
            { title: "Finance", desc: "Earnings, budgets, and forecasts.", icon: Wallet, color: "amber" },
          ].map(({ title, desc, icon: Icon, color }, i) => (
            <motion.div key={title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.03 }}>
            <Card className="transition hover:shadow-lg hover:-translate-y-0.5 border">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <span className={`flex h-9 w-9 items-center justify-center rounded-md bg-${color}-100 text-${color}-600`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <CardTitle className="text-foreground">{title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </CardContent>
            </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Key Features */}
      <section className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-gray-600 ring-1 ring-gray-200">
            <Shield className="h-4 w-4" />
            Key Features
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground">Everything you need to win</h2>
          <p className="mt-2 text-muted-foreground">Powerful tools designed for teams and individuals.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Advanced Analytics",
              desc: "Visualize metrics and trends with beautiful charts.",
              icon: BarChart3,
              color: "blue"
            },
            { 
              title: "Training Planner", 
              desc: "Plan blocks and monitor load progression.", 
              icon: Activity,
              color: "green"
            },
            { 
              title: "Medical Hub", 
              desc: "Centralize screenings, notes, and return-to-play.", 
              icon: Stethoscope,
              color: "red"
            },
          ].map(({ title, desc, icon: Icon, color }, i) => (
            <motion.div key={title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.03 }}>
            <Card className="border">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <span className={`flex h-9 w-9 items-center justify-center rounded-md bg-${color}-100 text-${color}-600`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <CardTitle className="text-foreground">{title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </CardContent>
            </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
