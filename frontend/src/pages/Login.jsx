import { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthShell from '../components/AuthShell';
import ErrorAlert from '../components/ErrorAlert';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Login() {
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
    setLoading(true);

    try {
      await login(username, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell>
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-space-600 bg-space-800 p-8 shadow-xl shadow-black/20"
      >
        <h2 className="mb-1 text-xl font-semibold text-white">Sign in</h2>
        <p className="mb-6 text-sm text-slate-400">
          Enter your credentials to access the QA dashboard
        </p>

        <div className="space-y-4">
          <div>
            <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-slate-300">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              autoComplete="username"
              required
              className="w-full rounded-lg border border-space-600 bg-space-900 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-saturn-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-300">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoComplete="current-password"
                required
                className="w-full rounded-lg border border-space-600 bg-space-900 px-4 py-2.5 pr-10 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-saturn-500"
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
        </div>

        <div className="mt-4">
          <ErrorAlert message={error} onDismiss={() => setError('')} />
        </div>

        <button
          type="submit"
          disabled={loading || !username || !password}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-saturn-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-saturn-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <LogIn className="h-4 w-4" />
          {loading ? 'Signing in...' : 'Sign in'}
        </button>

        <p className="mt-6 text-center text-sm text-slate-400">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="font-medium text-saturn-400 hover:text-saturn-300">
            Create account
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
