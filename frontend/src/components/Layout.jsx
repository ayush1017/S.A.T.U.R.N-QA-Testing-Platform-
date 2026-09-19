import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Bug,
  MessageSquare,
  Database,
  MessageCircleHeart,
  Rocket,
  LogOut,
  User,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/test-cases', icon: FileText, label: 'Test Cases' },
  { to: '/bug-reports', icon: Bug, label: 'Bug Reports' },
  { to: '/chat', icon: MessageSquare, label: 'QA Chat' },
  { to: '/test-data', icon: Database, label: 'Test Data' },
  { to: '/feedback', icon: MessageCircleHeart, label: 'Feedback' },
];

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen">
      <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-space-600 bg-space-800">
        <div className="flex items-center gap-3 border-b border-space-600 px-6 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-saturn-600 pulse-glow">
            <Rocket className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">SATURN</h1>
            <p className="text-xs text-slate-400">QA Agent v1.0</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-saturn-600/20 text-saturn-300'
                    : 'text-slate-400 hover:bg-space-700 hover:text-slate-200'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-space-600 px-4 py-4">
          <div className="mb-3 flex items-center gap-3 rounded-lg bg-space-900 px-3 py-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-saturn-600/20">
              <User className="h-4 w-4 text-saturn-400" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium text-slate-200">{user?.name}</p>
              <p className="truncate text-xs text-slate-500">{user?.username}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="h-5 w-5" />
            Sign out
          </button>
        </div>
      </aside>

      <main className="ml-64 flex-1">
        <div className="mx-auto max-w-6xl px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
