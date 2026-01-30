import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { Zap, Timer, Activity, Trophy, Play } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { Metadata } from "next";

// SEO Metadata for Landing Page
export const metadata: Metadata = {
  title: "NeuroDrive - F1 Cognitive Performance Training Platform",
  description: "Train your cognitive reflexes like an F1 Champion. Test your reaction time, decision making, and compete on global leaderboards. Instant start, no signup required.",
  keywords: ["reaction time", "F1", "cognitive training", "reflex test", "decision making", "performance analytics", "brain training"],
  authors: [{ name: "NeuroDrive Team" }],
  openGraph: {
    title: "NeuroDrive - F1 Cognitive Performance Training",
    description: "Train your cognitive reflexes like an F1 Champion. Reaction. Speed. Precision.",
    type: "website",
    locale: "en_US",
    siteName: "NeuroDrive",
  },
  twitter: {
    card: "summary_large_image",
    title: "NeuroDrive - F1 Cognitive Performance Training",
    description: "Train your cognitive reflexes like an F1 Champion",
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
}

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-background z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/20 rounded-full blur-[120px] opacity-20 animate-pulse" />
        </div>

        <div className="container px-4 md:px-6 relative z-10 flex flex-col items-center text-center space-y-8">
          <div className="space-y-4 max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic transform -skew-x-[10deg] text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              Neuro<span className="text-primary">Drive</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-[600px] mx-auto">
              Train your cognitive reflexes like an F1 Champion.
              Reaction. Speed. Precision.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="h-14 px-10 text-xl font-bold uppercase tracking-widest shadow-[0_0_30px_rgba(0,255,148,0.3)] hover:shadow-[0_0_50px_rgba(0,255,148,0.5)] transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
                Start Engine
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg" className="h-14 px-10 text-xl font-bold uppercase tracking-widest bg-transparent border-white/20 hover:bg-white/5 cursor-pointer">
                Telementry
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-muted-foreground">
          <span className="text-xs uppercase tracking-widest">Scroll to Analyze</span>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-black/50 backdrop-blur-sm border-t border-white/5">
        <div className="container px-4 md:px-6 mx-auto max-w-7xl">
          <div className="grid gap-12 md:grid-cols-3">
            <div className="flex flex-col items-center text-center space-y-4 p-8 rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/10 hover:border-primary/50 transition-colors group">
              <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Timer className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-2xl font-bold uppercase">Reaction Time</h3>
              <p className="text-muted-foreground">
                Measure your raw visual reflex speed to the millisecond. Compete against F1 driver benchmarks.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4 p-8 rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/10 hover:border-accent/50 transition-colors group">
              <div className="p-4 rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors">
                <Activity className="h-12 w-12 text-accent" />
              </div>
              <h3 className="text-2xl font-bold uppercase">Decision Making</h3>
              <p className="text-muted-foreground">
                High-pressure cognitive load tests. Make the right choice when tired or distracted.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4 p-8 rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/10 hover:border-blue-500/50 transition-colors group">
              <div className="p-4 rounded-full bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                <Trophy className="h-12 w-12 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold uppercase">Global Rankings</h3>
              <p className="text-muted-foreground">
                Compare your telemetry data with drivers from around the world. Secure your pole position.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 z-0" />
        <div className="container px-4 md:px-6 relative z-10 flex flex-col items-center text-center space-y-8 mx-auto max-w-7xl">
          <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">Ready to Race?</h2>
          <Link href="/dashboard">
            <Button size="lg" className="h-16 px-12 text-2xl font-bold uppercase tracking-widest bg-white text-black hover:bg-white/90 shadow-[0_0_30px_rgba(255,255,255,0.3)] cursor-pointer">
              Enter Cockpit <Play className="ml-4 h-6 w-6 fill-current" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/10 bg-black">
        <div className="container px-4 text-center text-sm text-muted-foreground mx-auto max-w-7xl">
          <p className="font-mono">NEURODRIVE v1.0 // PERFORMANCE ANALYTICS</p>
        </div>
      </footer>
    </div>
  );
}
