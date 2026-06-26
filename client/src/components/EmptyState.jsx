import React from 'react';
import { Database, SearchX, Inbox } from 'lucide-react';

export default function EmptyState({
  title = 'No feedback found',
  description = 'Try adjusting your search query or filters to discover other reviews.',
  type = 'search', // 'search' | 'data'
  actionButton = null,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
      <div className="flex items-center justify-center w-16 h-16 mb-5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 dark:text-indigo-400">
        {type === 'search' ? (
          <SearchX className="w-8 h-8" />
        ) : type === 'database' ? (
          <Database className="w-8 h-8" />
        ) : (
          <Inbox className="w-8 h-8" />
        )}
      </div>

      <h3 className="mb-2 text-lg font-bold text-slate-800 dark:text-slate-200">
        {title}
      </h3>
      
      <p className="max-w-md mb-6 text-sm text-slate-500 dark:text-slate-400">
        {description}
      </p>

      {actionButton && (
        <div className="flex justify-center">
          {actionButton}
        </div>
      )}
    </div>
  );
}
