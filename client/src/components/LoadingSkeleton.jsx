import React from 'react';

export function StatCardSkeleton() {
  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded"></div>
        <div className="h-8 w-8 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
      </div>
      <div className="h-8 w-16 bg-slate-300 dark:bg-slate-700 rounded mb-2"></div>
      <div className="h-3 w-32 bg-slate-200 dark:bg-slate-800 rounded"></div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm animate-pulse">
      <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
        <div className="h-6 w-36 bg-slate-200 dark:bg-slate-800 rounded"></div>
        <div className="h-8 w-44 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              {['Name', 'Category', 'Rating', 'Message', 'Date', 'Actions'].map((h, i) => (
                <th key={i} className="p-4"><div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded"></div></th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, idx) => (
              <tr key={idx} className="border-b border-slate-100 dark:border-slate-800/60">
                <td className="p-4">
                  <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded mb-1.5"></div>
                  <div className="h-3 w-40 bg-slate-100 dark:bg-slate-850 rounded"></div>
                </td>
                <td className="p-4"><div className="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded-full"></div></td>
                <td className="p-4"><div className="h-4 w-12 bg-slate-200 dark:bg-slate-800 rounded"></div></td>
                <td className="p-4"><div className="h-4 w-52 bg-slate-200 dark:bg-slate-800 rounded"></div></td>
                <td className="p-4"><div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded"></div></td>
                <td className="p-4"><div className="h-8 w-16 bg-slate-200 dark:bg-slate-800 rounded-lg"></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm animate-pulse h-80 flex flex-col justify-between">
      <div className="flex justify-between items-center">
        <div className="h-5 w-40 bg-slate-200 dark:bg-slate-800 rounded"></div>
        <div className="h-3 w-16 bg-slate-100 dark:bg-slate-850 rounded"></div>
      </div>
      <div className="flex-1 flex items-end gap-4 px-2 py-6">
        <div className="w-full bg-slate-100 dark:bg-slate-800/40 rounded-t-lg h-[40%]"></div>
        <div className="w-full bg-slate-200 dark:bg-slate-700/50 rounded-t-lg h-[75%]"></div>
        <div className="w-full bg-slate-100 dark:bg-slate-800/40 rounded-t-lg h-[55%]"></div>
        <div className="w-full bg-slate-200 dark:bg-slate-700/50 rounded-t-lg h-[90%]"></div>
        <div className="w-full bg-slate-100 dark:bg-slate-800/40 rounded-t-lg h-[30%]"></div>
      </div>
      <div className="flex justify-between">
        <div className="h-3 w-10 bg-slate-150 dark:bg-slate-850 rounded"></div>
        <div className="h-3 w-10 bg-slate-150 dark:bg-slate-850 rounded"></div>
        <div className="h-3 w-10 bg-slate-150 dark:bg-slate-850 rounded"></div>
      </div>
    </div>
  );
}
