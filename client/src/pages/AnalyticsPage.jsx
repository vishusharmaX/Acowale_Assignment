import React, { useEffect, useState } from 'react';
import { analyticsService } from '../services/api';
import { StatCardSkeleton, ChartSkeleton } from '../components/LoadingSkeleton';
import { BarChart3, TrendingUp, HelpCircle, Star, AlertCircle, RefreshCw } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import toast from 'react-hot-toast';

const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f59e0b', '#10b981', '#64748b'];

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await analyticsService.getAnalytics();
      setData(res.data);
    } catch (err) {
      console.error('[Fetch Analytics Error]:', err);
      setError(true);
      toast.error('Failed to load deep analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white">
            Feedback Intelligence
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Deep analytical charts and key performance metrics.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
        <ChartSkeleton />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-16 px-4 glass-panel border-rose-100 dark:border-rose-950/30 rounded-3xl">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
          Unable to Load Analytics Charts
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
          There was an error communicating with the feedback backend API to fetch aggregate metrics.
        </p>
        <button
          onClick={fetchAnalytics}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-sm hover:scale-[1.02] active:scale-[0.98] transition-transform"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Loading</span>
        </button>
      </div>
    );
  }

  const { summary, categoryDistribution, trendData } = data;

  // Calculate highest volume category and display it as an insight
  const sortedCategories = [...categoryDistribution].sort((a, b) => b.count - a.count);
  const topCategory = sortedCategories[0]?.count > 0 ? sortedCategories[0] : null;

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white">
            Feedback Intelligence
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Deep analytical charts and key performance metrics.
          </p>
        </div>

        <button
          onClick={fetchAnalytics}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors text-slate-600 dark:text-slate-300 shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Sync analytics</span>
        </button>
      </div>

      {/* Analytical Insights Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
          <span className="text-xs font-bold text-slate-450 uppercase tracking-wider block mb-2">
            Top Subject Focus
          </span>
          {topCategory ? (
            <div>
              <p className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">
                {topCategory.category}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-450 mt-1">
                Representing <span className="font-bold">{topCategory.count}</span> submissions.
              </p>
            </div>
          ) : (
            <p className="text-sm text-slate-400">No submissions tracked yet.</p>
          )}
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
          <span className="text-xs font-bold text-slate-450 uppercase tracking-wider block mb-2">
            Average Quality Rating
          </span>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-amber-500">
              {summary.averageRating}
            </span>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.round(summary.averageRating)
                      ? 'fill-amber-450 text-amber-450'
                      : 'text-slate-200 dark:text-slate-800'
                  }`}
                />
              ))}
            </div>
          </div>
          <p className="text-xs text-slate-450 mt-1">Overall customer sentiment level.</p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
          <span className="text-xs font-bold text-slate-450 uppercase tracking-wider block mb-2">
            Monthly Target Velocity
          </span>
          <p className="text-lg font-extrabold text-slate-800 dark:text-white">
            {summary.monthlyFeedback} submissions
          </p>
          <p className="text-xs text-slate-450 mt-1">Total inputs received this month.</p>
        </div>
      </div>

      {/* Trend Timeline Chart */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-indigo-500" />
          <h3 className="font-bold text-slate-800 dark:text-white text-base">
            Daily Submission Velocity
          </h3>
        </div>
        <div className="h-80">
          {summary.totalFeedback > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(203, 213, 225, 0.15)" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(15, 23, 42, 0.9)',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  name="Feedbacks"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', strokeWidth: 1.5, r: 4 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-sm text-slate-400">
              No trend data available.
            </div>
          )}
        </div>
      </div>

      {/* Side-by-side distribution and totals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category bar graph */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
          <div className="mb-6">
            <h3 className="font-bold text-slate-800 dark:text-white text-base">
              Feedback Volume breakdown
            </h3>
            <p className="text-xs text-slate-450 font-medium">
              Submissions volume per category area.
            </p>
          </div>
          <div className="h-72">
            {summary.totalFeedback > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryDistribution} margin={{ left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(203, 213, 225, 0.15)" />
                  <XAxis dataKey="category" stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(15, 23, 42, 0.9)',
                      border: 'none',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" name="Volume" radius={[4, 4, 0, 0]}>
                    {categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-slate-400">
                No breakdown data available.
              </div>
            )}
          </div>
        </div>

        {/* Categories proportion layout */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
          <div className="mb-6">
            <h3 className="font-bold text-slate-800 dark:text-white text-base">
              Proportional Composition
            </h3>
            <p className="text-xs text-slate-450 font-medium">
              Pie chart highlighting subject shares.
            </p>
          </div>
          <div className="h-72 flex flex-col justify-between">
            <div className="h-56 relative flex items-center justify-center">
              {summary.totalFeedback > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryDistribution.filter((c) => c.count > 0)}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="count"
                      nameKey="category"
                    >
                      {categoryDistribution
                        .filter((c) => c.count > 0)
                        .map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: 'rgba(15, 23, 42, 0.9)',
                        border: 'none',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-sm text-slate-400 text-center">
                  No breakdown data available.
                </div>
              )}
            </div>

            {/* Colors map labels */}
            {summary.totalFeedback > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {categoryDistribution
                  .filter((c) => c.count > 0)
                  .map((cat, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                      />
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate font-semibold">
                        {cat.category}
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
