import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Bot, User } from 'lucide-react';
import { api } from '../services/api';
import ErrorAlert from '../components/ErrorAlert';

const SUGGESTIONS = [
  'What is STLC?',
  'Explain Smoke Testing',
  'Difference between Severity and Priority',
  'Write a Playwright login script',
];

function renderMarkdown(text) {
  let html = text
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^[-*] (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`)
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br />');

  if (!html.startsWith('<')) {
    html = `<p>${html}</p>`;
  }

  return html;
}

export default function QAChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function sendMessage(text) {
    const userMessage = text || input;
    if (!userMessage.trim() || loading) return;

    setInput('');
    setError('');
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const history = messages.map(({ role, content }) => ({ role, content }));
      const { response } = await api.chat({ message: userMessage, history });
      setMessages([...newMessages, { role: 'assistant', content: response }]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="animate-fade-in flex h-[calc(100vh-4rem)] flex-col">
      <div className="mb-4">
        <div className="mb-1 flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-green-400" />
          <h1 className="text-2xl font-bold text-white">QA Chat Assistant</h1>
        </div>
        <p className="text-sm text-slate-400">
          Ask anything about software testing, methodologies, or automation.
        </p>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-space-600 bg-space-800">
        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          {messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center gap-4">
              <Bot className="h-12 w-12 text-slate-600" />
              <p className="text-sm text-slate-500">Ask me anything about QA and testing</p>
              <div className="flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="rounded-full border border-space-600 px-4 py-2 text-xs text-slate-400 transition-colors hover:border-saturn-500 hover:text-saturn-300"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-saturn-600/20">
                  <Bot className="h-4 w-4 text-saturn-400" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-xl px-4 py-3 text-sm ${
                  msg.role === 'user'
                    ? 'bg-saturn-600 text-white'
                    : 'bg-space-900 text-slate-300'
                }`}
              >
                {msg.role === 'assistant' ? (
                  <div
                    className="markdown-content"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
                  />
                ) : (
                  msg.content
                )}
              </div>
              {msg.role === 'user' && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-space-700">
                  <User className="h-4 w-4 text-slate-400" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-saturn-600/20">
                <Bot className="h-4 w-4 text-saturn-400" />
              </div>
              <div className="rounded-xl bg-space-900 px-4 py-3">
                <div className="flex gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-saturn-400" style={{ animationDelay: '0ms' }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-saturn-400" style={{ animationDelay: '150ms' }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-saturn-400" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-space-600 p-4">
          <ErrorAlert message={error} onDismiss={() => setError('')} />
          <form
            onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
            className="mt-2 flex gap-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a QA question..."
              disabled={loading}
              className="flex-1 rounded-lg border border-space-600 bg-space-900 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-saturn-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-lg bg-saturn-600 px-4 py-2.5 text-white transition-colors hover:bg-saturn-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
