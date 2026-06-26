import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { analyticsService, feedbackService } from '../services/api';
import AnimatedCounter from '../components/AnimatedCounter';
import { StatCardSkeleton, ChartSkeleton, TableSkeleton } from '../components/LoadingSkeleton';
import FeedbackDetailsModal from '../components/FeedbackDetailsModal';
import {
  MessageSquare,
  Clock,
  CalendarDays,
  Star,
  Users,
  TrendingUp,
  FileText,
  Settings,
  Sparkles,
  RefreshCw,
  Eye,
  Trash2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import toast from 'react-hot-toast';

// Styling colors for categories in Pie/Bar charts
const CHART_COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f59e0b', '#10b981', '#64748b'];

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await analyticsService.getAnalytics();
      setData(res.data);
    } catch (err) {
      console.error('[Fetch Analytics Error]:', err);
      setError(true);
      toast.error('Failed to load dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDeleteFeedback = async (id) => {
    try {
      await feedbackService.deleteFeedback(id);
      toast.success('Feedback deleted successfully!');
      // Refresh analytics
      fetchDashboardData();
    } catch (err) {
      console.error('[Delete Feedback Error]:', err);
      toast.error('Failed to delete feedback record.');
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white">
              Dashboard Overview
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Aggregated real-time metrics tracking.
            </p>
          </div>
        </div>
        
        {/* Metric Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>

        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2"><ChartSkeleton /></div>
          <ChartSkeleton />
        </div>

        {/* Table Skeleton */}
        <TableSkeleton rows={5} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-16 px-4 glass-panel border-rose-100 dark:border-rose-950/30 rounded-3xl">
        <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/20 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
          Unable to Load Dashboard Data
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
          There was an error communicating with the feedback backend API. Make sure your server is running.
        </p>
        <button
          onClick={fetchDashboardData}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-sm hover:scale-[1.02] active:scale-[0.98] transition-transform"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Loading</span>
        </button>
      </div>
    );
  }

  const { summary, categoryDistribution, trendData, recentActivity } = data;

  const statCards = [
    {
      title: 'Total Feedback',
      value: summary.totalFeedback,
      description: 'Accumulated reviews received',
      icon: MessageSquare,
      color: 'bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/5 dark:text-indigo-400',
    },
    {
      title: "Today's Volume",
      value: summary.todayFeedback,
      description: 'Submissions since midnight',
      icon: Clock,
      color: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/5 dark:text-amber-400',
    },
    {
      title: 'Weekly Submissions',
      value: summary.weeklyFeedback,
      description: 'Last 7 days volume',
      icon: CalendarDays,
      color: 'bg-purple-500/10 text-purple-600 dark:bg-purple-500/5 dark:text-purple-400',
    },
    {
      title: 'Average Rating',
      value: summary.averageRating,
      description: 'Cumulative quality mark',
      icon: Star,
      color: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/5 dark:text-emerald-400',
      isDecimal: true,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white">
            Dashboard Overview
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Realtime customer experience and aggregation hub.
          </p>
        </div>

        <button
          onClick={fetchDashboardData}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors text-slate-600 dark:text-slate-300 shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh stats</span>
        </button>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 shadow-sm hover:scale-[1.01] transition-transform duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-450 uppercase tracking-wider">
                  {card.title}
                </span>
                <div className={`p-2.5 rounded-xl ${card.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="flex items-baseline gap-1">
                <h3 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
                  <AnimatedCounter value={card.value} />
                </h3>
                {card.title === 'Average Rating' && (
                  <span className="text-sm font-semibold text-slate-400">/ 5</span>
                )}
              </div>
              <p className="text-xs text-slate-450 mt-1.5 font-medium">
                {card.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Recharts Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend line graph (col-span 2) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-slate-800 dark:text-white text-base">
                Feedback Trend
              </h3>
              <p className="text-xs text-slate-450 font-medium">
                Daily submission count over the past 7 days.
              </p>
            </div>
            <TrendingUp className="w-5 h-5 text-indigo-500" />
          </div>

          <div className="h-64">
            {summary.totalFeedback > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(203, 213, 225, 0.15)" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(val) => {
                      const parts = val.split('-');
                      return `${parts[1]}/${parts[2]}`; // mm/dd format
                    }}
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                  />
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
                    stroke="#6366f1"
                    strokeWidth={2.5}
                    dot={{ fill: '#6366f1', strokeWidth: 1, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-slate-400">
                No submissions data to plot trend line.
              </div>
            )}
          </div>
        </div>

        {/* Category Breakdown (Pie chart) */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
          <div className="mb-6">
            <h3 className="font-bold text-slate-800 dark:text-white text-base">
              Category Distribution
            </h3>
            <p className="text-xs text-slate-450 font-medium">
              Proportion breakdown by submission topic.
            </p>
          </div>

          <div className="h-56 relative flex items-center justify-center">
            {summary.totalFeedback > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryDistribution.filter((c) => c.count > 0)}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="count"
                    nameKey="category"
                  >
                    {categoryDistribution
                      .filter((c) => c.count > 0)
                      .map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
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
                No metrics to divide.
              </div>
            )}
            {summary.totalFeedback > 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-slate-800 dark:text-white leading-none">
                  {summary.totalFeedback}
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-450 mt-1">
                  Total
                </span>
              </div>
            )}
          </div>

          {/* Color Key Labels */}
          {summary.totalFeedback > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-4">
              {categoryDistribution
                .filter((c) => c.count > 0)
                .map((cat, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }}
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

      {/* Bar Chart volume breakdown per Category */}
      {summary.totalFeedback > 0 && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
          <div className="mb-6">
            <h3 className="font-bold text-slate-800 dark:text-white text-base">
              Feedback Volume by Category
            </h3>
            <p className="text-xs text-slate-450 font-medium">
              Submissions volume comparison per category area.
            </p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryDistribution} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(203, 213, 225, 0.15)" />
                <XAxis dataKey="category" tickLine={false} stroke="#94a3b8" fontSize={10} />
                <YAxis tickLine={false} stroke="#94a3b8" fontSize={10} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(15, 23, 42, 0.9)',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" fill="#8b5cf6" name="Submissions" radius={[4, 4, 0, 0]}>
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Recent Feedback Feed Section */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white text-base">
              Recent Feedback Activity
            </h3>
            <p className="text-xs text-slate-450 font-medium">
              The 5 most recent customer submissions.
            </p>
          </div>
          <Link
            to="/admin/feedback"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400 hover:underline flex items-center gap-1"
          >
            <span>View all entries</span>
            <span>→</span>
          </Link>
        </div>

        {recentActivity.length > 0 ? (
          <div className="overflow-x-auto -mx-6">
            <div className="inline-block min-w-full align-middle px-6">
              <div className="overflow-hidden border border-slate-100 dark:border-slate-800 rounded-xl">
                <table className="min-w-full divide-y divide-slate-150 dark:divide-slate-800 text-left text-sm">
                  <thead className="bg-slate-50/50 dark:bg-slate-800/20 text-xs font-bold uppercase tracking-wider text-slate-450">
                    <tr>
                      <th className="px-4 py-3.5">Customer</th>
                      <th className="px-4 py-3.5">Category</th>
                      <th className="px-4 py-3.5">Rating</th>
                      <th className="px-4 py-3.5">Submitted Date</th>
                      <th className="px-4 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/65">
                    {recentActivity.map((item) => (
                      <tr
                        key={item._id}
                        className="hover:bg-slate-50/40 dark:hover:bg-slate-800/20 transition-colors"
                      >
                        <td className="px-4 py-3.5">
                          <p className="font-bold text-slate-700 dark:text-slate-200">
                            {item.name}
                          </p>
                          <p className="text-xs text-slate-450">{item.email}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="inline-flex px-2 py-1 text-[10px] font-bold rounded-md bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-900/30">
                            {item.category}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span className="font-semibold text-slate-700 dark:text-slate-350">
                              {item.rating}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-xs text-slate-450 font-medium">
                          {new Date(item.createdAt).toLocaleString()}
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedFeedback(item)}
                              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 bg-white dark:bg-slate-900 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 transition-colors"
                              title="Quick Preview"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteFeedback(item._id)}
                              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-600 dark:hover:text-rose-450 bg-white dark:bg-slate-900 hover:bg-rose-50/30 dark:hover:bg-rose-950/20 transition-colors"
                              title="Quick Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400 text-sm border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            No feedback entries found. Start by submitting some!
          </div>
        )}
      </div>

      {/* Details View Modal */}
      {selectedFeedback && (
        <FeedbackDetailsModal
          feedback={selectedFeedback}
          onClose={() => setSelectedFeedback(null)}
          onDelete={handleDeleteFeedback}
        />
      )}
    </div>
  );
}
