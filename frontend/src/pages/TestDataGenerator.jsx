import { useState } from 'react';
import { Database, Sparkles, Copy, Check } from 'lucide-react';
import { api } from '../services/api';
import { exportTestDataPDF } from '../utils/pdfExport';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import ExportButton from '../components/ExportButton';

const DATA_TYPES = [
  { value: 'full', label: 'Full Profile', desc: 'Complete user profiles' },
  { value: 'names', label: 'Names', desc: 'First and last names' },
  { value: 'emails', label: 'Emails', desc: 'Email addresses' },
  { value: 'phones', label: 'Phone Numbers', desc: 'Mobile/phone numbers' },
  { value: 'addresses', label: 'Addresses', desc: 'Full addresses' },
  { value: 'login', label: 'Login Credentials', desc: 'Username, email, password' },
];

export default function TestDataGenerator() {
  const [dataType, setDataType] = useState('full');
  const [count, setCount] = useState(5);
  const [locale, setLocale] = useState('US');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  async function handleGenerate(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    setResult(null);

    try {
      const data = await api.generateTestData({ dataType, count, locale });
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function copyRecord(record) {
    const text = Object.entries(record)
      .filter(([k]) => k !== 'id')
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopiedId(record.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  const recordKeys = result?.records?.length
    ? Object.keys(result.records[0]).filter((k) => k !== 'id')
    : [];

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <div className="mb-1 flex items-center gap-2">
          <Database className="h-6 w-6 text-purple-400" />
          <h1 className="text-2xl font-bold text-white">Test Data Generator</h1>
        </div>
        <p className="text-sm text-slate-400">
          Generate realistic test data for form testing, user registration, and more.
        </p>
      </div>

      <form onSubmit={handleGenerate} className="space-y-4 rounded-xl border border-space-600 bg-space-800 p-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">Data Type</label>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
            {DATA_TYPES.map(({ value, label, desc }) => (
              <button
                key={value}
                type="button"
                onClick={() => setDataType(value)}
                className={`rounded-lg border p-3 text-left transition-colors ${
                  dataType === value
                    ? 'border-saturn-500 bg-saturn-600/10'
                    : 'border-space-600 bg-space-900 hover:border-space-500'
                }`}
              >
                <p className="text-sm font-medium text-slate-200">{label}</p>
                <p className="text-xs text-slate-500">{desc}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">Count</label>
            <input
              type="number"
              min={1}
              max={20}
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value) || 5)}
              className="w-full rounded-lg border border-space-600 bg-space-900 px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-saturn-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">Locale</label>
            <select
              value={locale}
              onChange={(e) => setLocale(e.target.value)}
              className="w-full rounded-lg border border-space-600 bg-space-900 px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-saturn-500"
            >
              <option value="US">United States</option>
              <option value="UK">United Kingdom</option>
              <option value="IN">India</option>
              <option value="EU">Europe</option>
            </select>
          </div>
        </div>

        <ErrorAlert message={error} onDismiss={() => setError('')} />

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg bg-saturn-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-saturn-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Sparkles className="h-4 w-4" />
          {loading ? 'Generating...' : 'Generate Test Data'}
        </button>
      </form>

      {loading && <LoadingSpinner text="AI is generating test data..." />}

      {result && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              Generated Data ({result.records?.length} records)
            </h2>
            <ExportButton onClick={() => exportTestDataPDF(result)} />
          </div>

          <div className="overflow-x-auto rounded-xl border border-space-600">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-space-600 bg-space-800">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">#</th>
                  {recordKeys.map((key) => (
                    <th key={key} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {key}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Copy</th>
                </tr>
              </thead>
              <tbody>
                {result.records?.map((record) => (
                  <tr key={record.id} className="border-b border-space-600/50 bg-space-900/50 hover:bg-space-800/50">
                    <td className="px-4 py-3 font-mono text-xs text-saturn-400">{record.id}</td>
                    {recordKeys.map((key) => (
                      <td key={key} className="px-4 py-3 text-slate-300">{record[key] || '—'}</td>
                    ))}
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => copyRecord(record)}
                        className="text-slate-500 hover:text-saturn-400"
                      >
                        {copiedId === record.id ? (
                          <Check className="h-4 w-4 text-green-400" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
