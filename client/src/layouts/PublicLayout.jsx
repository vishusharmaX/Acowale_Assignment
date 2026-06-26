import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, ArrowRight } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

export default function PublicLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">
      {/* Landing Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/60 dark:border-slate-800/60 bg-white/75 dark:bg-slate-950/75 backdrop-blur-md">
        <div className="container mx-auto max-w-7xl h-16 px-4 md:px-8 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="text-2xl">🐮</span>
            <span className="font-extrabold text-lg bg-gradient-to-r from-brand-600 to-indigo-600 bg-clip-text text-transparent dark:from-brand-400 dark:to-indigo-400">
              Acowale Portal
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              to="/admin"
              className="group flex items-center gap-1.5 px-4 py-2 text-xs md:text-sm font-semibold rounded-xl bg-slate-950 text-white dark:bg-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-sm"
            >
              <span>Console</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </header>

      {/* Landing Page Content Body */}
      <main className="flex-1">
        {children}
      </main>

      {/* Landing Footer */}
      <footer className="border-t border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-950 py-8">
        <div className="container mx-auto max-w-7xl px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500 dark:text-slate-450">
          <div>
            © {new Date().getFullYear()} Acowale CRM Machine Test. Built by Vishwajeet Sharma.
          </div>
          <div className="flex items-center gap-6">
            <Link to="/admin" className="hover:text-brand-500 transition-colors">
              CRM Admin Panel
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand-500 transition-colors"
            >
              GitHub Source
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
