import React from 'react';
import { motion } from 'framer-motion';
import FeedbackForm from '../components/FeedbackForm';
import { Sparkles, MessageSquareHeart, ShieldAlert, Cpu, Heart, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
  };

  const featureCards = [
    {
      title: 'Bug Reporting',
      description: 'Log and catalog development crashes or issues directly to engineering queues.',
      icon: ShieldAlert,
      color: 'text-rose-500 bg-rose-500/10 dark:bg-rose-500/5',
    },
    {
      title: 'Feature Requests',
      description: 'Vote, request, and vote-aggregate feedback for future iterations.',
      icon: Sparkles,
      color: 'text-purple-500 bg-purple-500/10 dark:bg-purple-500/5',
    },
    {
      title: 'Appreciation Hub',
      description: 'Collect, view, and share positive feedback from delighted clients.',
      icon: Heart,
      color: 'text-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/5',
    },
  ];

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors">
      {/* Background Glowing Ambient Orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-brand-500/10 dark:bg-brand-500/5 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] rounded-full bg-indigo-500/15 dark:bg-indigo-500/5 blur-[100px] pointer-events-none" />

      {/* Main Container */}
      <div className="container mx-auto max-w-7xl px-4 md:px-8 py-12 md:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Hero Text Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 space-y-8"
          >
            {/* Tagline Announcement */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/50 dark:bg-indigo-950/20 text-xs font-semibold text-indigo-600 dark:text-indigo-400 w-fit"
            >
              <Cpu className="w-3.5 h-3.5 animate-pulse-subtle" />
              <span>Next-Gen CRM Engine Live</span>
            </motion.div>

            {/* Hero Heading Title */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-800 dark:text-white leading-tight">
                Turn Customer Echoes Into{' '}
                <span className="text-gradient font-black">
                  Product Action
                </span>
              </h1>
              <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
                Streamline and organize customer bugs, suggest, and feedback directly into an elegant SaaS CRM pipeline. Build what they want, when they need it.
              </p>
            </motion.div>

            {/* Micro value props checklist */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 gap-4 max-w-md text-sm font-semibold text-slate-600 dark:text-slate-300"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-500 flex-shrink-0" />
                <span>Zod Validated Forms</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-500 flex-shrink-0" />
                <span>Rate-Limit Safety</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-500 flex-shrink-0" />
                <span>Real-Time Dashboards</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-500 flex-shrink-0" />
                <span>CSV Statistics Export</span>
              </div>
            </motion.div>

            {/* Feature Cards Grid (Hero segment) */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              {featureCards.map((card, i) => {
                const Icon = card.icon;
                return (
                  <div
                    key={i}
                    className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/40 hover:scale-[1.02] hover:bg-white dark:hover:bg-slate-900 transition-all duration-300 shadow-sm"
                  >
                    <div className={`p-2.5 rounded-xl w-fit ${card.color} mb-3.5`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-250 text-sm mb-1">
                      {card.title}
                    </h3>
                    <p className="text-xs text-slate-400 dark:text-slate-450 leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                );
              })}
            </motion.div>
          </motion.div>

          {/* Right Column: Interaction Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 80, delay: 0.3 }}
            className="lg:col-span-5"
          >
            <FeedbackForm />
          </motion.div>

        </div>
      </div>
    </div>
  );
}
