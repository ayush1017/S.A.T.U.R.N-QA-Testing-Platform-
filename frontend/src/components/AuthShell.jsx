import { Rocket } from 'lucide-react';

export default function AuthShell({ children }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-space-900 px-4">
      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-saturn-600/10 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-saturn-400/10 blur-3xl" />

      <div className="relative w-full max-w-md animate-fade-in">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-saturn-600 pulse-glow">
            <Rocket className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">SATURN</h1>
          <p className="mt-1 text-sm text-slate-400">
            Software Assurance Testing &amp; Unified Reporting Network
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
