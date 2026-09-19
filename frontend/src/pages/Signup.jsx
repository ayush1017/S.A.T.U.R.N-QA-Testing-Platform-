import { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { UserPlus, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthShell from '../components/AuthShell';
import ErrorAlert from '../components/ErrorAlert';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Signup() {
  const { register, isAuthenticated, loading: authLoading } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-space-900">
        <LoadingSpinner text="Loading..." />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await register({ name, username, email, password });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    'w-full rounded-lg border border-space-600 bg-space-900 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-saturn-500';

  return (
    <AuthShell>
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-space-600 bg-space-800 p-8 shadow-xl shadow-black/20"
      >
        <h2 className="mb-1 text-xl font-semibold text-white">Create account</h2>
        <p className="mb-6 text-sm text-slate-400">
          Sign up to start using the SATURN QA dashboard
        </p>

        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-300">
              Full Name *
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              autoComplete="name"
              required
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-slate-300">
              Username *
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              autoComplete="username"
              required
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-300">
              Email (optional)
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-300">
              Password *
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                autoComplete="new-password"
                required
                className={`${inputClass} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-slate-300">
              Confirm Password *
            </label>
            <input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              autoComplete="new-password"
              required
              className={inputClass}
            />
          </div>
        </div>

        <div className="mt-4">
          <ErrorAlert message={error} onDismiss={() => setError('')} />
        </div>

        <button
          type="submit"
          disabled={loading || !name || !username || !password || !confirmPassword}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-saturn-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-saturn-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <UserPlus className="h-4 w-4" />
          {loading ? 'Creating account...' : 'Create account'}
        </button>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-saturn-400 hover:text-saturn-300">
            Sign in
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
