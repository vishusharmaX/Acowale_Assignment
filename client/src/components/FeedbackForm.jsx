import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Star, Send, Loader2 } from 'lucide-react';
import { feedbackService } from '../services/api';
import toast from 'react-hot-toast';

// Define Validation Schema using Zod
const feedbackSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  category: z.enum(
    [
      'Bug Report',
      'Feature Request',
      'Complaint',
      'Suggestion',
      'Appreciation',
      'General Feedback',
    ],
    {
      errorMap: () => ({ message: 'Please select a valid feedback category' }),
    }
  ),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message cannot exceed 1000 characters'),
  rating: z
    .number()
    .min(1, 'Please rate your experience (min 1 star)')
    .max(5, 'Rating cannot exceed 5 stars'),
});

export default function FeedbackForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      name: '',
      email: '',
      category: '',
      message: '',
      rating: 0,
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await feedbackService.submitFeedback(data);
      toast.success('Thank you! Your feedback has been submitted successfully.');
      reset();
      setHoveredStar(0);
    } catch (error) {
      console.error('[Feedback Submit Error]:', error);
      const serverErrorMsg =
        error.response?.data?.message || 'Failed to submit feedback. Please try again.';
      toast.error(serverErrorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-panel p-6 md:p-8 rounded-3xl shadow-xl border border-white/20 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 transition-all duration-300">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white">
          Send Us Feedback
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Have a request or found a bug? Let our product team know instantly.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
            Your Name
          </label>
          <input
            type="text"
            placeholder="John Doe"
            disabled={isSubmitting}
            {...register('name')}
            className={`w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-slate-800 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
              errors.name
                ? 'border-rose-500 focus:border-rose-500 dark:border-rose-800'
                : 'border-slate-200 dark:border-slate-700 focus:border-brand-500 dark:focus:border-brand-500'
            }`}
          />
          {errors.name && (
            <p className="text-xs text-rose-500 dark:text-rose-450 mt-1 font-medium">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
            Email Address
          </label>
          <input
            type="email"
            placeholder="john@example.com"
            disabled={isSubmitting}
            {...register('email')}
            className={`w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-slate-800 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
              errors.email
                ? 'border-rose-500 focus:border-rose-500 dark:border-rose-800'
                : 'border-slate-200 dark:border-slate-700 focus:border-brand-500 dark:focus:border-brand-500'
            }`}
          />
          {errors.email && (
            <p className="text-xs text-rose-500 dark:text-rose-450 mt-1 font-medium">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Category Dropdown */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
            Category
          </label>
          <select
            disabled={isSubmitting}
            {...register('category')}
            className={`w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-slate-800 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
              errors.category
                ? 'border-rose-500 focus:border-rose-500 dark:border-rose-800'
                : 'border-slate-200 dark:border-slate-700 focus:border-brand-500 dark:focus:border-brand-500'
            }`}
          >
            <option value="">Select Category</option>
            <option value="Bug Report">Bug Report 🐛</option>
            <option value="Feature Request">Feature Request ✨</option>
            <option value="Complaint">Complaint ⚠️</option>
            <option value="Suggestion">Suggestion 💡</option>
            <option value="Appreciation">Appreciation ❤️</option>
            <option value="General Feedback">General Feedback 💬</option>
          </select>
          {errors.category && (
            <p className="text-xs text-rose-500 dark:text-rose-450 mt-1 font-medium">
              {errors.category.message}
            </p>
          )}
        </div>

        {/* Star Rating */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
            Rating
          </label>
          <Controller
            name="rating"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5 py-1">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const ratingValue = i + 1;
                    return (
                      <motion.button
                        key={i}
                        type="button"
                        disabled={isSubmitting}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        onMouseEnter={() => setHoveredStar(ratingValue)}
                        onMouseLeave={() => setHoveredStar(0)}
                        onClick={() => field.onChange(ratingValue)}
                        className="text-2xl focus:outline-none"
                      >
                        <Star
                          className={`w-7 h-7 stroke-[1.5] transition-colors ${
                            ratingValue <= (hoveredStar || field.value)
                              ? 'fill-amber-450 text-amber-450 dark:text-amber-450'
                              : 'text-slate-300 dark:text-slate-600'
                          }`}
                        />
                      </motion.button>
                    );
                  })}
                </div>
                {errors.rating && (
                  <p className="text-xs text-rose-500 dark:text-rose-450 mt-0.5 font-medium">
                    {errors.rating.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>

        {/* Message Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
            Your Message
          </label>
          <textarea
            rows={4}
            disabled={isSubmitting}
            placeholder="Type details about your experience here..."
            {...register('message')}
            className={`w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-slate-800 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
              errors.message
                ? 'border-rose-500 focus:border-rose-500 dark:border-rose-800'
                : 'border-slate-200 dark:border-slate-700 focus:border-brand-500 dark:focus:border-brand-500'
            }`}
          />
          {errors.message && (
            <p className="text-xs text-rose-500 dark:text-rose-450 mt-1 font-medium">
              {errors.message.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={!isSubmitting ? { scale: 1.01 } : {}}
          whileTap={!isSubmitting ? { scale: 0.99 } : {}}
          className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-lg shadow-brand-500/25 transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Submit Feedback</span>
            </>
          )}
        </motion.button>
      </form>
    </div>
  );
}
