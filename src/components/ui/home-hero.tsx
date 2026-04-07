"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { GlassCard } from "./glass-card";
import { Logo } from "./logo";

export function HomeHero() {
  return (
    <div className="relative flex flex-col flex-1 items-center justify-center min-h-screen px-4 overflow-hidden pt-20 pb-20">
      {/* Navbar/Header integration just for visual completeness on the homepage */}
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center max-w-6xl mx-auto w-full z-50 pt-8"
      >
        <Logo className="w-10 h-10" />
        <div className="flex gap-4">
          <Link
            href="/admin-login"
            className="text-text-secondary text-sm font-medium hover:text-white transition-colors duration-200 px-4 py-2"
          >
            Admin
          </Link>
          <Link
            href="/login"
            className="flex items-center justify-center px-5 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-sm transition-all duration-200 backdrop-blur-md"
          >
            Sign In
          </Link>
        </div>
      </motion.nav>

      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <motion.div 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[120px]" 
        />
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-accent/[0.03] to-transparent" />
        {/* Abstract grid lines overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full bg-accent/[0.08] border border-accent/20 backdrop-blur-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
          </span>
          <span className="text-xs font-semibold text-accent tracking-widest uppercase">Live Protocol</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tighter leading-[1.1] text-center mb-6"
        >
          <span className="text-white drop-shadow-sm">Wealth, </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-400 drop-shadow-[0_0_20px_rgba(0,211,149,0.3)]">
            Ascended.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-lg sm:text-xl text-text-secondary leading-relaxed max-w-2xl text-center mb-10"
        >
          Experience the pinnacle of hybrid finance. Aggregate traditional banking and decentralized yield seamlessly in one premium dashboard.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/login"
            className="group relative inline-flex items-center justify-center px-8 py-4 rounded-xl bg-accent text-bg-primary font-bold text-base overflow-hidden transition-transform active:scale-95"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <span className="relative">Launch Dashboard</span>
          </Link>
        </motion.div>

        {/* Dashboard Preview mockup / 3D element */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.7, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full mt-24 relative perspective-[1000px]"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-accent/30 to-blue-500/30 rounded-[2rem] blur-xl opacity-30 animate-pulse" />
          <GlassCard className="p-2 border border-white/10 rounded-[2rem] bg-bg-primary/50 shadow-2xl overflow-hidden backdrop-blur-2xl ring-1 ring-white/5 mx-auto max-w-4xl" glow>
            {/* Fake Dashboard Header */}
            <div className="flex justify-between items-center p-4 border-b border-white/5 opacity-50">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="h-4 w-32 bg-white/5 rounded-full" />
            </div>
            
            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-1 md:col-span-2 space-y-6">
                {/* Total Balance Mockup */}
                <div className="bg-bg-card/40 p-6 rounded-2xl border border-white/5 shadow-inner">
                  <p className="text-sm text-text-secondary font-medium tracking-wide">TOTAL BALANCE</p>
                  <p className="text-5xl font-light text-white my-3 flex items-baseline gap-2">
                    <span className="text-text-secondary font-medium">$</span>124,592<span className="text-2xl text-accent font-medium">.45</span>
                  </p>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-accent to-blue-400 w-[68%]" />
                  </div>
                </div>
                {/* Chart Mockup */}
                <div className="bg-bg-card/40 p-6 rounded-2xl border border-white/5 h-40 relative overflow-hidden flex items-end">
                  <svg className="w-full h-full text-accent opacity-50" viewBox="0 0 100 40" preserveAspectRatio="none">
                     <path d="M0,40 L0,30 C20,20 40,40 60,25 C80,10 90,15 100,5 L100,40 Z" fill="url(#grad)" />
                     <path d="M0,30 C20,20 40,40 60,25 C80,10 90,15 100,5" stroke="currentColor" strokeWidth="1" fill="none" />
                     <defs>
                       <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="0%" stopColor="currentColor" stopOpacity="0.5" />
                         <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                       </linearGradient>
                     </defs>
                  </svg>
                </div>
              </div>
              <div className="col-span-1 space-y-6">
                <div className="bg-gradient-to-br from-[#1E2532] to-[#131722] p-6 rounded-2xl border border-white/10 aspect-[1.58] relative overflow-hidden flex flex-col justify-between shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                  {/* Card Mockup */}
                  <div className="w-full flex justify-between">
                     <div className="w-8 h-8 rounded-full border border-white/20 bg-white/5" />
                     <Logo className="w-6 h-6" withText={false} />
                  </div>
                  <div>
                    <div className="flex gap-3 mb-2 font-mono text-white/30 tracking-[0.2em] text-lg">
                      <span>****</span><span>****</span><span>****</span><span className="text-white/80">9024</span>
                    </div>
                    <div className="flex justify-between items-end">
                      <p className="text-sm font-medium text-white/80 uppercase">Black Tier</p>
                      <p className="text-xs font-mono text-white/50">12/28</p>
                    </div>
                  </div>
                </div>
                <div className="bg-bg-card/40 p-6 rounded-2xl border border-white/5">
                   <p className="text-sm text-text-secondary font-medium tracking-wide mb-4">RECENT ACTIVITY</p>
                   <div className="space-y-4">
                     {[1, 2, 3].map(i => (
                       <div key={i} className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-accent/10 flex-shrink-0" />
                         <div className="flex-1">
                           <div className="h-2 w-16 bg-white/10 rounded-full mb-2" />
                           <div className="h-1.5 w-12 bg-white/5 rounded-full" />
                         </div>
                       </div>
                     ))}
                   </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

    </div>
  );
}
