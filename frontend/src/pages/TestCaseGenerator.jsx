import { useState } from 'react';
import { FileText, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { exportTestCasesPDF } from '../utils/pdfExport';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import ExportButton from '../components/ExportButton';

function TestCaseCard({ testCase }) {
  return (
    <div className="rounded-lg border border-space-600 bg-space-800 p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-xs text-saturn-400">{testCase.id}</span>
        {testCase.priority && (
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            testCase.priority === 'High' ? 'bg-red-500/20 text-red-400' :
            testCase.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-green-500/20 text-green-400'
          }`}>
            {testCase.priority}
          </span>
        )}
      </div>
      <h4 className="mb-2 font-medium text-white">{testCase.title}</h4>
      {testCase.preconditions && (
        <p className="mb-2 text-xs text-slate-500">
          <span className="font-medium text-slate-400">Preconditions:</span> {testCase.preconditions}
        </p>
      )}
      {testCase.steps && (
        <ol className="mb-2 list-decimal space-y-1 pl-4 text-sm text-slate-300">
          {testCase.steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      )}
      {testCase.expectedResult && (
        <p className="text-sm text-slate-400">
          <span className="font-medium text-slate-300">Expected:</span> {testCase.expectedResult}
        </p>
      )}
      {testCase.description && (
        <p className="text-sm text-slate-400">{testCase.description}</p>
      )}
    </div>
  );
}

function ResultSection({ title, items, color }) {
  if (!items?.length) return null;
  return (
    <div>
      <h3 className={`mb-3 text-sm font-semibold ${color}`}>{title} ({items.length})</h3>
      <div className="space-y-3">
        {items.map((item) => (
          <TestCaseCard key={item.id} testCase={item} />
        ))}
      </div>
    </div>
  );
}

export default function TestCaseGenerator() {
  const [requirement, setRequirement] = useState('');
  const [userStory, setUserStory] = useState('');
  const [featureDescription, setFeatureDescription] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleGenerate(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    setResult(null);

    try {
      const data = await api.generateTestCases({ requirement, userStory, featureDescription });
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
          <FileText className="h-6 w-6 text-saturn-400" />
          <h1 className="text-2xl font-bold text-white">Test Case Generator</h1>
        </div>
        <p className="text-sm text-slate-400">
          Enter a requirement, user story, or feature description to generate comprehensive test cases.
        </p>
      </div>

      <form onSubmit={handleGenerate} className="space-y-4 rounded-xl border border-space-600 bg-space-800 p-6">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Requirement</label>
          <textarea
            value={requirement}
            onChange={(e) => setRequirement(e.target.value)}
            placeholder='e.g. "User should be able to login using email and password."'
            rows={3}
            className="w-full rounded-lg border border-space-600 bg-space-900 px-4 py-3 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-saturn-500"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">User Story (optional)</label>
          <textarea
            value={userStory}
            onChange={(e) => setUserStory(e.target.value)}
            placeholder='e.g. "As a registered user, I want to login so that I can access my dashboard."'
            rows={2}
            className="w-full rounded-lg border border-space-600 bg-space-900 px-4 py-3 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-saturn-500"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Feature Description (optional)</label>
          <textarea
            value={featureDescription}
            onChange={(e) => setFeatureDescription(e.target.value)}
            placeholder="Additional context about the feature..."
            rows={2}
            className="w-full rounded-lg border border-space-600 bg-space-900 px-4 py-3 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-saturn-500"
          />
        </div>

        <ErrorAlert message={error} onDismiss={() => setError('')} />

        <button
          type="submit"
          disabled={loading || (!requirement && !userStory && !featureDescription)}
          className="inline-flex items-center gap-2 rounded-lg bg-saturn-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-saturn-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Sparkles className="h-4 w-4" />
          {loading ? 'Generating...' : 'Generate Test Cases'}
        </button>
      </form>

      {loading && <LoadingSpinner text="AI is generating test cases..." />}

      {result && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Generated Test Cases</h2>
            <ExportButton onClick={() => exportTestCasesPDF(result)} />
          </div>

          <ResultSection title="Test Scenarios" items={result.scenarios} color="text-blue-400" />
          <ResultSection title="Positive Test Cases" items={result.positiveCases} color="text-green-400" />
          <ResultSection title="Negative Test Cases" items={result.negativeCases} color="text-red-400" />
          <ResultSection title="Edge Cases" items={result.edgeCases} color="text-yellow-400" />
        </div>
      )}
    </div>
  );
}
