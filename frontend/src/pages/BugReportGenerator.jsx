import { useState } from 'react';
import { Bug, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { exportBugReportPDF } from '../utils/pdfExport';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import ExportButton from '../components/ExportButton';

const severityColors = {
  Critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  Major: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  Minor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Trivial: 'bg-green-500/20 text-green-400 border-green-500/30',
};

const priorityColors = {
  High: 'bg-red-500/20 text-red-400',
  Medium: 'bg-yellow-500/20 text-yellow-400',
  Low: 'bg-green-500/20 text-green-400',
};

export default function BugReportGenerator() {
  const [summary, setSummary] = useState('');
  const [stepsPerformed, setStepsPerformed] = useState('');
  const [actualResult, setActualResult] = useState('');
  const [expectedResult, setExpectedResult] = useState('');
  const [environment, setEnvironment] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleGenerate(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    setResult(null);

    try {
      const data = await api.generateBugReport({
        summary,
        stepsPerformed,
        actualResult,
        expectedResult,
        environment,
      });
      setResult(data);
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
          <Bug className="h-6 w-6 text-red-400" />
          <h1 className="text-2xl font-bold text-white">Bug Report Generator</h1>
        </div>
        <p className="text-sm text-slate-400">
          Describe the bug and SATURN will generate a professional, structured bug report.
        </p>
      </div>

      <form onSubmit={handleGenerate} className="space-y-4 rounded-xl border border-space-600 bg-space-800 p-6">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Bug Summary *</label>
          <input
            type="text"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Brief description of the bug"
            className="w-full rounded-lg border border-space-600 bg-space-900 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-saturn-500"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Steps Performed *</label>
          <textarea
            value={stepsPerformed}
            onChange={(e) => setStepsPerformed(e.target.value)}
            placeholder="Describe the steps you took before encountering the bug"
            rows={3}
            className="w-full rounded-lg border border-space-600 bg-space-900 px-4 py-3 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-saturn-500"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Actual Result *</label>
          <textarea
            value={actualResult}
            onChange={(e) => setActualResult(e.target.value)}
            placeholder="What actually happened?"
            rows={2}
            className="w-full rounded-lg border border-space-600 bg-space-900 px-4 py-3 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-saturn-500"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Expected Result (optional)</label>
          <textarea
            value={expectedResult}
            onChange={(e) => setExpectedResult(e.target.value)}
            placeholder="What should have happened?"
            rows={2}
            className="w-full rounded-lg border border-space-600 bg-space-900 px-4 py-3 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-saturn-500"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Environment (optional)</label>
          <input
            type="text"
            value={environment}
            onChange={(e) => setEnvironment(e.target.value)}
            placeholder="e.g. Windows 11, Chrome 120, v2.1.0"
            className="w-full rounded-lg border border-space-600 bg-space-900 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-saturn-500"
          />
        </div>

        <ErrorAlert message={error} onDismiss={() => setError('')} />

        <button
          type="submit"
          disabled={loading || !summary || !stepsPerformed || !actualResult}
          className="inline-flex items-center gap-2 rounded-lg bg-saturn-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-saturn-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Sparkles className="h-4 w-4" />
          {loading ? 'Generating...' : 'Generate Bug Report'}
        </button>
      </form>

      {loading && <LoadingSpinner text="AI is creating your bug report..." />}

      {result && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Bug Report</h2>
            <ExportButton onClick={() => exportBugReportPDF(result)} />
          </div>

          <div className="rounded-xl border border-space-600 bg-space-800 p-6">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="font-mono text-lg font-bold text-saturn-400">{result.bugId}</span>
              <span className={`rounded-full border px-3 py-1 text-xs font-medium ${severityColors[result.severity] || severityColors.Minor}`}>
                {result.severity}
              </span>
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${priorityColors[result.priority] || priorityColors.Medium}`}>
                Priority: {result.priority}
              </span>
            </div>

            <h3 className="mb-4 text-base font-semibold text-white">{result.summary}</h3>

            {result.environment && (
              <div className="mb-4 rounded-lg bg-space-900 p-4">
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Environment</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {Object.entries(result.environment).map(([key, val]) => (
                    <div key={key}>
                      <span className="text-slate-500">{key}: </span>
                      <span className="text-slate-300">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-4">
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Steps to Reproduce</h4>
              <ol className="list-decimal space-y-1 pl-5 text-sm text-slate-300">
                {result.stepsToReproduce?.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-lg bg-green-500/5 p-4">
                <h4 className="mb-1 text-xs font-semibold uppercase text-green-400">Expected Result</h4>
                <p className="text-sm text-slate-300">{result.expectedResult}</p>
              </div>
              <div className="rounded-lg bg-red-500/5 p-4">
                <h4 className="mb-1 text-xs font-semibold uppercase text-red-400">Actual Result</h4>
                <p className="text-sm text-slate-300">{result.actualResult}</p>
              </div>
            </div>

            {result.additionalNotes && (
              <div className="mt-4 rounded-lg bg-space-900 p-4">
                <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Additional Notes</h4>
                <p className="text-sm text-slate-400">{result.additionalNotes}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
