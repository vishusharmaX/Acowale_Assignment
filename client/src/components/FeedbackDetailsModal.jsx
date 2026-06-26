import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Calendar, Star, Trash2, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

const categoryStyles = {
  'Bug Report': 'bg-rose-50 text-rose-700 border-rose-200/50 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-800/30',
  'Feature Request': 'bg-purple-50 text-purple-700 border-purple-200/50 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-800/30',
  'Complaint': 'bg-amber-50 text-amber-700 border-amber-200/50 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800/30',
  'Suggestion': 'bg-blue-50 text-blue-700 border-blue-200/50 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800/30',
  'Appreciation': 'bg-emerald-50 text-emerald-700 border-emerald-200/50 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800/30',
  'General Feedback': 'bg-slate-50 text-slate-700 border-slate-200/50 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-700/30',
};

export default function FeedbackDetailsModal({ feedback, onClose, onDelete }) {
  const [copied, setCopied] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  if (!feedback) return null;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(feedback.email);
    setCopied(true);
    toast.success('Email address copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = () => {
    onDelete(feedback._id);
    setShowConfirmDelete(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ scale: 0.95, y: 15, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 15, opacity: 0 }}
          transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
          className="relative w-full max-w-lg overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl z-10"
        >
          {/* Header Panel */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Feedback Details
              </span>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white truncate max-w-[280px]">
                Submission Info
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content body */}
          <div className="p-6 space-y-6">
            {/* Meta row: Category Badge & Date */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                  categoryStyles[feedback.category] || categoryStyles['General Feedback']
                }`}
              >
                {feedback.category}
              </span>

              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                <Calendar className="w-4 h-4" />
                <span>{new Date(feedback.createdAt).toLocaleString()}</span>
              </div>
            </div>

            {/* Author Profile Information */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-150/40 dark:border-slate-800 flex items-start gap-4">
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-lg">
                {feedback.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm truncate">
                  {feedback.name}
                </h3>
                <div className="flex items-center gap-2 mt-0.5 group">
                  <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {feedback.email}
                  </span>
                  <button
                    onClick={handleCopyEmail}
                    className="p-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    title="Copy Email Address"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Rating Stars Summary */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-400">Rating</span>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    className={`w-5 h-5 ${
                      idx < feedback.rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-250 dark:text-slate-700'
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                  {feedback.rating} / 5
                </span>
              </div>
            </div>

            {/* Message Block */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-400">Message</span>
              <div className="p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-850/60 border border-slate-100 dark:border-slate-800/80 max-h-56 overflow-y-auto">
                <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-line">
                  {feedback.message}
                </p>
              </div>
            </div>
          </div>

          {/* Footer Panel Actions */}
          <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 flex items-center justify-between">
            <AnimatePresence mode="wait">
              {!showConfirmDelete ? (
                <motion.button
                  key="delete-trigger"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  onClick={() => setShowConfirmDelete(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 dark:border-rose-800/50 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-600 dark:text-rose-450 text-sm font-semibold transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Feedback
                </motion.button>
              ) : (
                <motion.div
                  key="delete-confirm"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="flex items-center gap-2"
                >
                  <span className="text-xs font-medium text-rose-500 mr-2">Are you sure?</span>
                  <button
                    onClick={handleDelete}
                    className="px-3.5 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition-colors shadow-sm"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setShowConfirmDelete(false)}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-300 dark:hover:bg-slate-750 transition-colors border border-slate-300 dark:border-slate-700"
                  >
                    Cancel
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900 text-sm font-semibold transition-colors shadow-sm"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
