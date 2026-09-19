import { useState, useEffect, useCallback } from 'react';
import { MessageCircleHeart, Send, Star } from 'lucide-react';
import { api } from '../services/api';
import ErrorAlert from '../components/ErrorAlert';
import LoadingSpinner from '../components/LoadingSpinner';

const CATEGORIES = [
  { value: 'general', label: 'General' },
  { value: 'bug', label: 'Bug / Issue' },
  { value: 'feature', label: 'Feature Request' },
  { value: 'ui', label: 'UI / UX' },
  { value: 'ai', label: 'AI Quality' },
  { value: 'other', label: 'Other' },
];

const statusColors = {
  open: 'bg-blue-500/20 text-blue-400',
  reviewed: 'bg-yellow-500/20 text-yellow-400',
  resolved: 'bg-green-500/20 text-green-400',
};

export default function Feedback() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [category, setCategory] = useState('general');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [history, setHistory] = useState([]);

  const loadHistory = useCallback(async () => {
    try {
      setHistoryLoading(true);
      const data = await api.getFeedbackHistory();
      setHistory(data.history || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!rating) {
      setError('Please select a rating');
      return;
    }

    setLoading(true);

    try {
      const data = await api.submitFeedback({ rating, category, subject, message });
      if (data.emailSent) {
        setSuccess('Thanks! Your feedback was submitted and emailed successfully.');
      } else {
        setSuccess(
          data.emailWarning
            ? `Feedback saved, but email failed: ${data.emailWarning}`
            : 'Feedback saved, but email could not be sent. Check SMTP settings.',
        );
      }
      setRating(0);
      setCategory('general');
      setSubject('');
      setMessage('');
      await loadHistory();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <div className="mb-1 flex items-center gap-2">
          <MessageCircleHeart className="h-6 w-6 text-pink-400" />
          <h1 className="text-2xl font-bold text-white">Feedback</h1>
        </div>
        <p className="text-sm text-slate-400">
          Share your experience with SATURN — ratings, issues, and feature ideas help improve the product.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl border border-space-600 bg-space-800 p-6"
      >
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">Rating *</label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((value) => {
              const active = value <= (hoverRating || rating);
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  onMouseEnter={() => setHoverRating(value)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="rounded p-1 transition-transform hover:scale-110"
                  aria-label={`Rate ${value} star${value > 1 ? 's' : ''}`}
                >
                  <Star
                    className={`h-7 w-7 ${
                      active ? 'fill-yellow-400 text-yellow-400' : 'text-slate-600'
                    }`}
                  />
                </button>
              );
            })}
            {rating > 0 && (
              <span className="ml-2 text-sm text-slate-400">{rating} / 5</span>
            )}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Category</label>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
            {CATEGORIES.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setCategory(value)}
                className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                  category === value
                    ? 'border-saturn-500 bg-saturn-600/10 text-saturn-300'
                    : 'border-space-600 bg-space-900 text-slate-400 hover:border-space-500'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="subject" className="mb-1.5 block text-sm font-medium text-slate-300">
            Subject *
          </label>
          <input
            id="subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Short summary of your feedback"
            maxLength={120}
            required
            className="w-full rounded-lg border border-space-600 bg-space-900 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-saturn-500"
          />
        </div>

        <div>
          <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-slate-300">
            Message *
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us what worked well, what didn't, or what you'd like to see next..."
            rows={5}
            maxLength={2000}
            required
            className="w-full rounded-lg border border-space-600 bg-space-900 px-4 py-3 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-saturn-500"
          />
          <p className="mt-1 text-right text-xs text-slate-500">{message.length}/2000</p>
        </div>

        <ErrorAlert message={error} onDismiss={() => setError('')} />

        {success && (
          <div className="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !rating || !subject.trim() || !message.trim()}
          className="inline-flex items-center gap-2 rounded-lg bg-saturn-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-saturn-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
          {loading ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Your Feedback History</h2>

        {historyLoading && <LoadingSpinner text="Loading feedback..." />}

        {!historyLoading && history.length === 0 && (
          <div className="rounded-xl border border-space-600 bg-space-800 p-8 text-center text-sm text-slate-500">
            No feedback submitted yet. Share your first thoughts above.
          </div>
        )}

        {!historyLoading && history.length > 0 && (
          <div className="space-y-3">
            {history.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-space-600 bg-space-800 p-5"
              >
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <Star
                        key={value}
                        className={`h-3.5 w-3.5 ${
                          value <= item.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="rounded-full bg-space-900 px-2 py-0.5 text-xs capitalize text-slate-400">
                    {item.category}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs capitalize ${
                      statusColors[item.status] || statusColors.open
                    }`}
                  >
                    {item.status}
                  </span>
                  <span className="ml-auto text-xs text-slate-500">
                    {new Date(item.createdAt).toLocaleString()}
                  </span>
                </div>
                <h3 className="mb-1 font-medium text-white">{item.subject}</h3>
                <p className="text-sm text-slate-400 whitespace-pre-wrap">{item.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
