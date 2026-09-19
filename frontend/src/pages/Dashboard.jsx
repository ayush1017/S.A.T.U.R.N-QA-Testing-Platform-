import { Link } from 'react-router-dom';
import {
  FileText,
  Bug,
  MessageSquare,
  Database,
  MessageCircleHeart,
  Sparkles,
  ArrowRight,
  Zap,
} from 'lucide-react';

const features = [
  {
    to: '/test-cases',
    icon: FileText,
    title: 'Test Case Generator',
    description: 'Generate test scenarios, positive, negative, and edge cases from requirements.',
    color: 'from-blue-500/20 to-blue-600/5',
    iconColor: 'text-blue-400',
  },
  {
    to: '/bug-reports',
    icon: Bug,
    title: 'Bug Report Generator',
    description: 'Create professional bug reports with severity, priority, and reproduction steps.',
    color: 'from-red-500/20 to-red-600/5',
    iconColor: 'text-red-400',
  },
  {
    to: '/chat',
    icon: MessageSquare,
    title: 'QA Chat Assistant',
    description: 'Ask testing questions, get explanations, and generate automation scripts.',
    color: 'from-green-500/20 to-green-600/5',
    iconColor: 'text-green-400',
  },
  {
    to: '/test-data',
    icon: Database,
    title: 'Test Data Generator',
    description: 'Generate realistic names, emails, phone numbers, and addresses for form testing.',
    color: 'from-purple-500/20 to-purple-600/5',
    iconColor: 'text-purple-400',
  },
  {
    to: '/feedback',
    icon: MessageCircleHeart,
    title: 'Feedback',
    description: 'Rate SATURN and share suggestions, bugs, or feature requests.',
    color: 'from-pink-500/20 to-pink-600/5',
    iconColor: 'text-pink-400',
  },
];

const stats = [
  { label: 'AI-Powered', value: 'Gemini / GPT' },
  { label: 'Export', value: 'PDF Ready' },
  { label: 'Version', value: 'MVP 1.0' },
];

export default function Dashboard() {
  return (
    <div className="animate-fade-in space-y-8">
      <div className="relative overflow-hidden rounded-2xl border border-space-600 bg-gradient-to-br from-space-800 to-space-900 p-8">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-saturn-600/10 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-saturn-400/10 blur-3xl" />
        <div className="relative">
          <div className="mb-2 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-saturn-400" />
            <span className="text-sm font-medium text-saturn-400">AI-Powered QA Assistant</span>
          </div>
          <h1 className="mb-3 text-3xl font-bold text-white">
            Welcome to SATURN
          </h1>
          <p className="max-w-2xl text-slate-400">
            Software Assurance Testing &amp; Unified Reporting Network. Generate test cases,
            create bug reports, get instant QA answers, and produce test data — all powered by AI.
          </p>
          <div className="mt-6 flex gap-6">
            {stats.map(({ label, value }) => (
              <div key={label}>
                <p className="text-xs text-slate-500">{label}</p>
                <p className="text-sm font-semibold text-slate-200">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-saturn-400" />
          <h2 className="text-lg font-semibold text-white">Quick Access</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {features.map(({ to, icon: Icon, title, description, color, iconColor }) => (
            <Link
              key={to}
              to={to}
              className={`group rounded-xl border border-space-600 bg-gradient-to-br ${color} p-6 transition-all hover:border-saturn-500/50 hover:shadow-lg hover:shadow-saturn-500/5`}
            >
              <div className="mb-4 flex items-center justify-between">
                <div className={`rounded-lg bg-space-800 p-2.5 ${iconColor}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <ArrowRight className="h-5 w-5 text-slate-600 transition-transform group-hover:translate-x-1 group-hover:text-saturn-400" />
              </div>
              <h3 className="mb-1 text-base font-semibold text-white">{title}</h3>
              <p className="text-sm text-slate-400">{description}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-space-600 bg-space-800 p-6">
        <h3 className="mb-3 text-sm font-semibold text-slate-300">Example Workflow</h3>
        <ol className="space-y-2 text-sm text-slate-400">
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-saturn-600/20 text-xs font-bold text-saturn-400">1</span>
            Enter a requirement like &quot;User should be able to login using email and password&quot;
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-saturn-600/20 text-xs font-bold text-saturn-400">2</span>
            Click Generate to get functional, negative, and boundary test cases
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-saturn-600/20 text-xs font-bold text-saturn-400">3</span>
            Review results and export as PDF for your test documentation
          </li>
        </ol>
      </div>
    </div>
  );
}
