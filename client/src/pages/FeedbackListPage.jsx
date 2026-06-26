import React, { useEffect, useState } from 'react';
import { feedbackService } from '../services/api';
import { useDebounce } from '../hooks/useDebounce';
import { exportFeedbackToCSV } from '../utils/csvExport';
import { TableSkeleton } from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import FeedbackDetailsModal from '../components/FeedbackDetailsModal';
import {
  Search,
  Filter,
  Download,
  Star,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';

const categoryColors = {
  'Bug Report': 'bg-rose-50 text-rose-700 border-rose-100/50 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30',
  'Feature Request': 'bg-purple-50 text-purple-700 border-purple-100/50 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900/30',
  'Complaint': 'bg-amber-50 text-amber-700 border-amber-100/50 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30',
  'Suggestion': 'bg-blue-50 text-blue-700 border-blue-100/50 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30',
  'Appreciation': 'bg-emerald-50 text-emerald-700 border-emerald-100/50 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30',
  'General Feedback': 'bg-slate-50 text-slate-700 border-slate-200/50 dark:bg-slate-800/40 dark:text-slate-400 dark:border-slate-700/30',
};

export default function FeedbackListPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [rating, setRating] = useState('All');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalCount: 0, totalPages: 1, currentPage: 1, limit: 10 });
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [exporting, setExporting] = useState(false);

  // Debounce search query changes by 400ms to reduce API queries
  const debouncedSearch = useDebounce(search, 400);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 10,
        sortBy: 'createdAt',
        order: 'desc',
      };
      if (debouncedSearch.trim() !== '') params.search = debouncedSearch;
      if (category !== 'All') params.category = category;
      if (rating !== 'All') params.rating = rating;

      const res = await feedbackService.getFeedbacks(params);
      setFeedbacks(res.data.feedbacks);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error('[Fetch Feedbacks Error]:', err);
      toast.error('Failed to retrieve feedback records.');
    } finally {
      setLoading(false);
    }
  };

  // Trigger data fetch on filter and page changes
  useEffect(() => {
    fetchFeedbacks();
  }, [debouncedSearch, category, rating, page]);

  // Reset page index to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category, rating]);

  const handleDeleteFeedback = async (id) => {
    try {
      await feedbackService.deleteFeedback(id);
      toast.success('Feedback record deleted.');
      fetchFeedbacks();
    } catch (err) {
      console.error('[Delete Feedback Error]:', err);
      toast.error('Failed to delete feedback record.');
    }
  };

  // Export filtered query entries to CSV format
  const handleExportCSV = async () => {
    setExporting(true);
    try {
      // Retrieve the entire filtered set of items by removing paging limit restrictions
      const params = {
        limit: 5000,
        sortBy: 'createdAt',
        order: 'desc',
      };
      if (debouncedSearch.trim() !== '') params.search = debouncedSearch;
      if (category !== 'All') params.category = category;
      if (rating !== 'All') params.rating = rating;

      const res = await feedbackService.getFeedbacks(params);
      const allFilteredFeedbacks = res.data.feedbacks;
      
      exportFeedbackToCSV(allFilteredFeedbacks);
      toast.success(`Exported ${allFilteredFeedbacks.length} feedback items!`);
    } catch (err) {
      console.error('[Export Error]:', err);
      toast.error('CSV Export failed.');
    } finally {
      setExporting(false);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('All');
    setRating('All');
    toast.success('Search and filter criteria cleared.');
  };

  return (
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white">
            Feedback Catalog
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Query, search, inspect, and delete submissions records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            disabled={exporting || feedbacks.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {exporting ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Panel */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, text..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-slate-800 dark:text-slate-100"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div className="relative">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-slate-800 dark:text-slate-100 appearance-none cursor-pointer"
          >
            <option value="All">All Categories</option>
            <option value="Bug Report">Bug Report</option>
            <option value="Feature Request">Feature Request</option>
            <option value="Complaint">Complaint</option>
            <option value="Suggestion">Suggestion</option>
            <option value="Appreciation">Appreciation</option>
            <option value="General Feedback">General Feedback</option>
          </select>
        </div>

        {/* Rating Filter */}
        <div className="relative">
          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-slate-800 dark:text-slate-100 appearance-none cursor-pointer"
          >
            <option value="All">All Ratings</option>
            <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
            <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
            <option value="3">⭐⭐⭐ (3 Stars)</option>
            <option value="2">⭐⭐ (2 Stars)</option>
            <option value="1">⭐ (1 Star)</option>
          </select>
        </div>

        {/* Clear Filters CTA */}
        <button
          onClick={clearFilters}
          disabled={!search && category === 'All' && rating === 'All'}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-dashed border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-semibold text-xs rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-slate-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Filter className="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>
      </div>

      {/* Grid or Table Listing */}
      {loading ? (
        <TableSkeleton rows={10} />
      ) : feedbacks.length > 0 ? (
        <div className="w-full bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 text-xs font-bold uppercase tracking-wider text-slate-450">
                  <th className="p-4 pl-6">Customer</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4">Message Snippet</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/65">
                {feedbacks.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-slate-50/40 dark:hover:bg-slate-800/10 transition-colors"
                  >
                    <td className="p-4 pl-6">
                      <p className="font-bold text-slate-700 dark:text-slate-200">
                        {item.name}
                      </p>
                      <p className="text-xs text-slate-450">{item.email}</p>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex px-2.5 py-1 text-[10px] font-bold rounded-full border ${
                          categoryColors[item.category] || categoryColors['General Feedback']
                        }`}
                      >
                        {item.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          {item.rating}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 max-w-xs md:max-w-md truncate text-xs text-slate-500 dark:text-slate-400">
                      {item.message}
                    </td>
                    <td className="p-4 text-xs text-slate-450 font-medium">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedFeedback(item)}
                          className="p-2 rounded-xl border border-slate-200 dark:border-slate-750 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 bg-white dark:bg-slate-900 transition-colors"
                          title="Inspect Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteFeedback(item._id)}
                          className="p-2 rounded-xl border border-slate-200 dark:border-slate-750 text-slate-400 hover:text-rose-600 dark:hover:text-rose-450 hover:bg-rose-50/40 dark:hover:bg-rose-950/20 bg-white dark:bg-slate-900 transition-colors"
                          title="Delete Record"
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

          {/* Pagination Navigation Footer */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between p-4 px-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/10">
              <span className="text-xs text-slate-450 font-medium">
                Showing Page <span className="font-bold text-slate-700 dark:text-slate-350">{pagination.currentPage}</span> of{' '}
                <span className="font-bold text-slate-700 dark:text-slate-350">{pagination.totalPages}</span>
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={pagination.currentPage === 1}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-slate-600 dark:text-slate-455"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 px-2.5">
                  {pagination.currentPage}
                </span>

                <button
                  onClick={() => setPage((prev) => Math.min(pagination.totalPages, prev + 1))}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-slate-600 dark:text-slate-455"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <EmptyState
          title="No feedback matching filters"
          description="We couldn't find any feedback records matching your search term or filtering criteria. Try clearing them to see other submissions."
          actionButton={
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-750 text-white rounded-xl font-semibold text-xs shadow-sm transition-colors"
            >
              Clear filters
            </button>
          }
        />
      )}

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
