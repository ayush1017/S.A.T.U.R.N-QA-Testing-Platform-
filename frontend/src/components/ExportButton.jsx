import { Download } from 'lucide-react';

export default function ExportButton({ onClick, label = 'Export PDF' }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-lg border border-space-600 bg-space-700 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:border-saturn-500 hover:text-saturn-300"
    >
      <Download className="h-4 w-4" />
      {label}
    </button>
  );
}
