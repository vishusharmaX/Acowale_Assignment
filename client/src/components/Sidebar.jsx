import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, BarChart3, Settings, LogOut, Home, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Sidebar({ isOpen, setIsOpen }) {
  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Feedback List', path: '/admin/feedback', icon: MessageSquare },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Settings & Tools', path: '/admin/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 border-r bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 transition-transform duration-300 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header Branding */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🐮</span>
            <div>
              <h1 className="font-bold text-slate-800 dark:text-white text-base tracking-wide leading-none">
                Acowale CRM
              </h1>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                Control Center
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-lg lg:hidden hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/admin'}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 group ${
                  isActive
                    ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25 dark:shadow-brand-500/10'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                }`
              }
            >
              {({ isActive }) => {
                const Icon = item.icon;
                return (
                  <>
                    <Icon
                      className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${
                        isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500 group-hover:text-brand-500'
                      }`}
                    />
                    <span>{item.name}</span>
                  </>
                );
              }}
            </NavLink>
          ))}
        </nav>

        {/* Footer Info & Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs text-slate-400 font-medium">Appearance</span>
            <ThemeToggle />
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-semibold text-sm">
              VS
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate leading-none mb-0.5">
                Vishwajeet S.
              </p>
              <span className="text-[10px] text-slate-400 truncate block">
                Lead CRM Admin
              </span>
            </div>
            <NavLink
              to="/"
              className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              title="Return to Public Portal"
            >
              <Home className="w-4.5 h-4.5" />
            </NavLink>
          </div>
        </div>
      </aside>
    </>
  );
}
