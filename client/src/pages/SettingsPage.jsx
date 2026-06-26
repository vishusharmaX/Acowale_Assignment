import React, { useState, useEffect } from 'react';
import { systemService, feedbackService } from '../services/api';
import { Cpu, Database, RefreshCw, Sparkles, Trash2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const mockFeedbacks = [
  {
    name: 'Sarah Connor',
    email: 'sarah.c@skyline.io',
    category: 'Bug Report',
    rating: 2,
    message: 'The chart details modal shows a brief flickering issue on iOS Chrome. Kindly inspect.',
  },
  {
    name: 'Bruce Wayne',
    email: 'bruce@waynecorp.com',
    category: 'Feature Request',
    rating: 5,
    message: 'We require a real-time webhook push integration to trigger Slack notifications for Bug category items.',
  },
  {
    name: 'Peter Parker',
    email: 'peter.p@dailybugle.org',
    category: 'General Feedback',
    rating: 4,
    message: 'The website responsiveness looks stellar. The dark mode toggling works super smoothly.',
  },
  {
    name: 'Tony Stark',
    email: 'tony@stark.com',
    category: 'Appreciation',
    rating: 5,
    message: 'Incredible SaaS CRM. Very clean MVC API design and gorgeous UI aesthetics. Love the Purple accents.',
  },
  {
    name: 'Clark Kent',
    email: 'clark@dailyplanet.com',
    category: 'Complaint',
    rating: 1,
    message: 'The message length validation doesn\'t permit details below 10 characters. This blocks quick feedback.',
  },
  {
    name: 'Diana Prince',
    email: 'diana@themiscira.org',
    category: 'Suggestion',
    rating: 5,
    message: 'Add an automated export format for XLS sheet schedules next to the CSV exporter button.',
  },
  {
    name: 'Hal Jordan',
    email: 'greenlantern@oa.org',
    category: 'Bug Report',
    rating: 2,
    message: 'Failed to compile on Edge version 112 when clearing search inputs quickly.',
  },
  {
    name: 'Selina Kyle',
    email: 'selina@gothamcats.net',
    category: 'Suggestion',
    rating: 4,
    message: 'Provide filters sorting by Rating volume in ascending order, not just newest dates.',
  },
  {
    name: 'Barry Allen',
    email: 'barry.allen@ccpd.gov',
    category: 'Feature Request',
    rating: 5,
    message: 'Need a fast shortcut key (e.g. Command + K) to toggle global console command palette.',
  },
];

export default function SettingsPage() {
  const [health, setHealth] = useState(null);
  const [checkingHealth, setCheckingHealth] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const checkAPIHealth = async () => {
    setCheckingHealth(true);
    try {
      const res = await systemService.checkHealth();
      setHealth(res);
      toast.success('Backend connection healthy!');
    } catch (err) {
      console.error('[Health Check Error]:', err);
      setHealth({ status: 'OFFLINE', timestamp: new Date().toISOString() });
      toast.error('Backend server appears offline.');
    } finally {
      setCheckingHealth(false);
    }
  };

  useEffect(() => {
    checkAPIHealth();
  }, []);

  // Submit the array of mock records to seed the database
  const handleSeedData = async () => {
    setSeeding(true);
    let count = 0;
    try {
      for (const item of mockFeedbacks) {
        await feedbackService.submitFeedback(item);
        count++;
      }
      toast.success(`Seeded ${count} mock feedback items successfully!`);
    } catch (err) {
      console.error('[Seeding Error]:', err);
      toast.error(`Seeded ${count} items before encountering a rate limit or API block.`);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white">
          CRM Settings & Tools
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Inspect backend status, seed test data, and configure environment states.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* API connection and statistics */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 shadow-sm space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <Cpu className="w-5 h-5 text-indigo-500" />
            <h3 className="font-bold text-slate-800 dark:text-white text-base">
              System Connections
            </h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/80">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Backend API Engine
                </p>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mt-1">
                  Status: {health ? (
                    <span className={`font-bold ${health.status === 'OK' ? 'text-green-500' : 'text-red-500'}`}>
                      {health.status}
                    </span>
                  ) : 'Checking...'}
                </p>
              </div>
              <button
                onClick={checkAPIHealth}
                disabled={checkingHealth}
                className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-750 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shadow-sm disabled:opacity-50"
                title="Verify Health Check"
              >
                <RefreshCw className={`w-4 h-4 ${checkingHealth ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {health && health.status === 'OK' && (
              <div className="text-xs space-y-2 text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-4">
                <div className="flex justify-between">
                  <span>Server Environment:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{health.env}</span>
                </div>
                <div className="flex justify-between">
                  <span>Server Uptime:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    {Math.floor(health.uptime)} seconds
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Heartbeat Timestamp:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    {new Date(health.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Database sandbox seeder tools */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 shadow-sm space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-5 h-5 text-indigo-500" />
            <h3 className="font-bold text-slate-800 dark:text-white text-base">
              Sandbox Database Tools
            </h3>
          </div>

          <p className="text-xs text-slate-450 leading-relaxed">
            Need sample feedback entries to verify charts and pagination? Use the mock seeder tool to submit 9 premium reviews.
          </p>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Generate Mock Feedback
                </h4>
                <p className="text-xs text-slate-450 mt-0.5">
                  Submits 9 pre-filled records representing various categories and ratings.
                </p>
              </div>
              <button
                onClick={handleSeedData}
                disabled={seeding}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md shadow-indigo-600/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {seeding ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Seeding...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Seed Sandbox Data</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
