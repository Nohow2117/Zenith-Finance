"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { GlassCard } from "./glass-card";
import { Logo } from "./logo";

export function HomeHero() {
  return (
    <div className="relative flex flex-col flex-1 items-center justify-center min-h-screen px-4 overflow-hidden pt-20 pb-20">
      {/* Navbar/Header */}
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center max-w-6xl mx-auto w-full z-50 pt-8"
      >
        <Logo className="w-10 h-10" />
        <div className="flex gap-4">
          <Link
            href="/login"
            className="flex items-center justify-center px-5 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-sm transition-all duration-200 backdrop-blur-md"
          >
            Web App
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
          The gold standard for passive income. ArtDeFinance offers frictionless, low-volatile yields up to 20% APY on your stablecoin deposits, seamlessly integrated with your traditional banking.
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
            <span className="relative">Start Earning 20% APY</span>
          </Link>
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.7, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full mt-24 relative perspective-[1000px]"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-accent/30 to-blue-500/30 rounded-[2rem] blur-xl opacity-30 animate-pulse" />
          <GlassCard className="p-2 border border-white/10 rounded-[2rem] bg-bg-primary/50 shadow-2xl overflow-hidden backdrop-blur-2xl ring-1 ring-white/5 mx-auto max-w-4xl" glow>
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
                <div className="bg-bg-card/40 p-6 rounded-2xl border border-white/5 shadow-inner">
                  <p className="text-sm text-text-secondary font-medium tracking-wide">TOTAL DEPOSITS</p>
                  <p className="text-5xl font-light text-white my-3 flex items-baseline gap-2">
                    <span className="text-text-secondary font-medium">$</span>124,592<span className="text-2xl text-accent font-medium">.45</span>
                  </p>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-accent to-blue-400 w-[68%]" />
                  </div>
                </div>
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
                   <p className="text-sm text-text-secondary font-medium tracking-wide mb-4">RECENT INTEREST</p>
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

      {/* Value Propositions / Features Section */}
      <div className="relative z-10 w-full max-w-6xl mt-32 md:mt-48 mb-24 px-4">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-6"
          >
            Better <span className="text-accent text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-400">savings</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-text-secondary text-base md:text-lg max-w-2xl mx-auto"
          >
            ArtDeFinance provides a principal-protected, stable savings product that pays out a reliable interest rate, untouched by market volatility.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {[
            { title: "Frictionless Yield", desc: "Deposit stablecoins and start earning instantly. No complex staking mechanisms, no lock-up periods. Just pure, auto-compounding interest.", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
            { title: "Principal Protection", desc: "Your deposits are secured by over-collateralized loans and robust smart contracts audited by industry-leading security firms.", icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
            { title: "Instant Withdrawals", desc: "Your liquidity is yours. Withdraw your principal and accrued interest at any moment with zero friction, straight to your fiat account.", icon: "M3 3v18h18 M3 16l5-5 4 4 8-8" },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-bg-card/30 border border-white/5 p-8 rounded-3xl hover:bg-bg-card/50 transition-colors group"
            >
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={feature.icon} />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
              <p className="text-text-secondary leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* The Story Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-4xl mx-auto mb-32 px-4 text-center"
      >
        <h2 className="text-sm font-bold tracking-[0.2em] text-accent uppercase mb-4">Our Mission</h2>
        <h3 className="text-3xl md:text-5xl font-bold mb-8">Democratizing access to high-yield savings</h3>
        <div className="space-y-6 text-text-secondary text-lg leading-relaxed max-w-3xl mx-auto">
          <p>
            In traditional finance, high-yield opportunities are gatekept for the ultra-wealthy. Savings accounts offer negligible interest, while inflation quietly erodes your purchasing power. We believe there is a better way.
          </p>
          <p>
            <strong className="text-white font-medium">ArtDeFinance</strong> was built to be the Stripe for savings—a protocol that connects the high-yield monetary policies of decentralized finance directly to your everyday banking experience. 
          </p>
          <p>
            By capturing real cash flows from over-collateralized borrowing demand, we can offer a fixed, low-volatile APY that traditional banking simply cannot match. Completely decentralized. Completely transparent.
          </p>
        </div>
      </motion.div>

      {/* Social Proof / Testimonials Section */}
      <div className="relative z-10 w-full max-w-6xl mb-32 px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Trusted by 15,000+ early adopters</h2>
          <p className="text-text-secondary">Join the fastest growing decentralized savings protocol.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { quote: "Finally, a savings protocol that actually works. 20% APY without the mind-numbing complexity of yield farming. Pure magic.", author: "Alex Jenkins", role: "Web3 Founder", initials: "AJ" },
            { quote: "The integration between fiat on-ramps and the decentralized engine is flawless. Best place to park my liquid capital.", author: "Sarah Li", role: "Venture Capitalist", initials: "SL" },
            { quote: "Principal protection and instant withdrawals were the selling point for me. My capital has never been safer.", author: "Marcus Thorne", role: "Day Trader", initials: "MT" },
          ].map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="bg-bg-card/40 border border-white/5 p-8 rounded-3xl relative"
            >
              <div className="text-accent text-4xl font-serif absolute top-6 left-6 opacity-20">"</div>
              <p className="text-white/90 text-lg relative z-10 leading-relaxed mb-8 pt-4">
                {testimonial.quote}
              </p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-blue-500 flex items-center justify-center text-bg-primary font-bold text-sm">
                  {testimonial.initials}
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{testimonial.author}</p>
                  <p className="text-text-secondary text-xs">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Call to Action Footer */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="w-full relative py-20 px-4 mt-12 border-t border-white/10"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-accent/[0.02] to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <Logo className="w-16 h-16 mx-auto justify-center mb-4" withText={false} />
          <h2 className="text-4xl font-bold">Ready to transcend your capital?</h2>
          <p className="text-text-secondary text-lg">Join the ArtDeFinance secure savings protocol.</p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-10 py-4 rounded-xl bg-accent text-bg-primary font-bold text-lg hover:bg-accent-hover transition-colors active:scale-95 shadow-[0_0_30px_rgba(0,211,149,0.2)]"
          >
            Deposit & Earn
          </Link>
        </div>
      </motion.div>

    </div>
  );
}
