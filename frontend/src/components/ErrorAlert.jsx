import { AlertCircle, X } from 'lucide-react';

export default function ErrorAlert({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div className="flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 animate-fade-in">
      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
      <p className="flex-1 text-sm text-red-300">{message}</p>
      {onDismiss && (
        <button onClick={onDismiss} className="text-red-400 hover:text-red-300">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
