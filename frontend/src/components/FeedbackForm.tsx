'use client';

import React, { useState } from 'react';
import { Send, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';

export default function FeedbackForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('bug');
  const [priority, setPriority] = useState('medium');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await api.post('/feedback', {
        title,
        description,
        category,
        priority,
      });
      
      toast.success('Feedback submitted! Thank you!');
      setTitle('');
      setDescription('');
      setCategory('bug');
      setPriority('medium');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-teal-400 transition-colors"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Tell us more details..."
          rows={4}
          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-teal-400 transition-colors resize-none"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">
          Category
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-teal-400 transition-colors"
        >
          <option value="bug">Bug Report</option>
          <option value="feature">Feature Request</option>
          <option value="improvement">Improvement</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Priority */}
      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">
          Priority
        </label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-teal-400 transition-colors"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-teal-500 to-indigo-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-teal-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {loading ? (
          <>
            <Loader size={18} className="animate-spin" />
            <span>Submitting...</span>
          </>
        ) : (
          <>
            <Send size={18} />
            <span>Send Feedback</span>
          </>
        )}
      </button>
    </form>
  );
}
