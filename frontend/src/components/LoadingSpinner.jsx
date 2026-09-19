export default function LoadingSpinner({ text = 'Generating...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <div className="relative h-12 w-12">
        <div className="absolute inset-0 rounded-full border-2 border-space-600" />
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-saturn-500" />
      </div>
      <p className="text-sm text-slate-400">{text}</p>
    </div>
  );
}
