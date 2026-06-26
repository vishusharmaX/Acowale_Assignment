import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Menu, Home, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-300">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content Workspace Panel */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top Control Bar */}
        <header className="flex items-center justify-between h-16 px-6 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 rounded-xl lg:hidden hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-100 transition-colors"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-semibold tracking-wider uppercase">
              <span>Console</span>
              <span>/</span>
              <span className="text-slate-800 dark:text-slate-200 font-bold">
                Admin Area
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick Link Home */}
            <Link
              to="/"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="View Public Portal"
            >
              <Home className="w-5 h-5" />
            </Link>

            <button
              className="relative p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
            </button>

            {/* Separator line */}
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-800" />

            {/* User admin profile badge */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-450 hidden md:block">
                Vishwajeet Sharma
              </span>
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm border border-indigo-200/20">
                VS
              </div>
            </div>
          </div>
        </header>

        {/* Inner Content scroll region */}
        <main className="flex-1 overflow-y-auto px-6 py-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
