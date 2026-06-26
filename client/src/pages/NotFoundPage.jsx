import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Compass } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-6 py-12 transition-colors">
      <div className="text-center space-y-6 max-w-md">
        <motion.div
          initial={{ rotate: -15, scale: 0.8, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="w-20 h-20 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-3xl flex items-center justify-center mx-auto"
        >
          <Compass className="w-10 h-10 animate-pulse-subtle" />
        </motion.div>
        
        <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white">
          404 - Page Discovered Missing
        </h2>
        
        <p className="text-sm text-slate-500 dark:text-slate-400">
          The console routing path you requested does not exist or has been relocated to another workspace tab.
        </p>

        <div className="pt-4 flex justify-center">
          <Link
            to="/"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-750 text-white font-bold text-sm shadow-md shadow-indigo-600/10 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Return to Public Portal</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
