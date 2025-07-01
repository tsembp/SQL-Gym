import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { challengeApi } from '../api/apiService.ts';
import type { Challenge, EvalRequest, EvalResponse } from '../api/api.ts';
import Editor from '@monaco-editor/react';
import Footer from '../components/Footer.tsx';

export default function Challenge() {
  const { id } = useParams();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<EvalResponse | null>(null);

  useEffect(() => {
    challengeApi.getChallenge(Number(id)).then(setChallenge);
  }, [id]);

  const handleSubmit = async () => {
    const evalRequest: EvalRequest = { 
        challenge_id: Number(id),
        user_answer: query 
    };
    const res = await challengeApi.evaluateQuery(evalRequest);
    setResult(res);
  };

  const getDifficultyStyles = (difficulty: string) => {
    switch (difficulty) {
      case 'BASIC':
      case 'EASY':
        return 'bg-green-50 text-green-700';
      case 'MEDIUM':
        return 'bg-yellow-50 text-yellow-700';
      default:
        return 'bg-red-50 text-red-700';
    }
  };

  return (
    <div className="px-8 py-8 max-w-[1400px] mx-auto">
      {/* Back to Home Button */}
      <div className="mb-8">
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 no-underline rounded-md border border-gray-300 text-sm font-medium transition-colors hover:bg-gray-200"
      >
        ← Back to Challenges
      </Link>
      </div>
      
      {challenge && (
        <div className="grid gap-12 md:grid-cols-2 items-start justify-center max-w-[1200px] mx-auto">
          {/* LEFT COLUMN – Challenge Info */}
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900 m-0">
                  #{challenge.id} – {challenge.title}
                </h1>
                <span className={`text-sm font-semibold px-3 py-1 rounded-full ${getDifficultyStyles(challenge.difficulty)}`}>
                  {challenge.difficulty}
                </span>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-900">
                  Challenge Description
                </h3>
                <p className="text-gray-900 leading-relaxed m-0">
                  {challenge.prompt}
                </p>
              </div>

              {challenge.hints && challenge.hints.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">
                    Hints
                  </h3>
                  <ul className="list-none p-0 m-0">
                    {challenge.hints.map((hint, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start mb-1">
                        <span className="text-blue-500 mr-2">💡</span>
                        {hint}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {challenge.example_data && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4 text-gray-900">
                  Example Database
                </h2>
                <div className="flex flex-col gap-6 text-sm">
                  {Object.entries(challenge.example_data).map(([tableName, rows]: [string, any[]]) => (
                    <div key={tableName} className="border border-gray-300 rounded-lg overflow-hidden">
                      <div className="bg-gray-100 p-4 border-b border-gray-300">
                        <h3 className="font-medium text-gray-800 flex items-center gap-2 m-0">
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            TABLE
                          </span>
                          {tableName}
                          <span className="text-xs text-gray-500">
                            ({rows.length} rows)
                          </span>
                        </h3>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead className="bg-gray-50">
                            <tr>
                              {Object.keys(rows[0] || {}).map((col) => (
                                <th key={col} className="border-r border-gray-200 p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  {col}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="bg-white">
                            {rows.map((row, idx) => (
                              <tr key={idx} className={idx > 0 ? 'border-t border-gray-200' : ''}>
                                {Object.values(row).map((val, i) => (
                                  <td key={i} className="border-r border-gray-200 p-3 text-sm text-gray-900">
                                    {val !== null && val !== undefined ? String(val) : 
                                      <span className="text-gray-400 italic">NULL</span>
                                    }
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN – SQL Editor */}
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold mb-3 text-gray-900">
                Your SQL Query
              </h2>
              <div className="border border-gray-300 rounded overflow-hidden">
                <Editor
                  height="400px"
                  language="sql"
                  theme="vs-light"
                  value={query}
                  onChange={(v) => setQuery(v || '')}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                  }}
                />
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleSubmit}
                  disabled={!query.trim()}
                  className={`px-6 py-2 rounded font-medium transition-colors ${
                    !query.trim() 
                      ? 'bg-gray-400 text-white cursor-not-allowed opacity-50'
                      : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                  }`}
                >
                  Run Query
                </button>
                <button
                  onClick={() => setQuery('')}
                  className="px-4 py-2 bg-gray-500 text-white rounded cursor-pointer hover:bg-gray-600 transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Results Section */}
            {result && (
              <div className={`rounded-lg p-4 border ${
                result.success 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-red-200 bg-red-50'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-lg font-semibold ${
                    result.success ? 'text-green-700' : 'text-red-600'
                  }`}>
                    {result.success ? '✅ Correct!' : '❌ Incorrect'}
                  </span>
                </div>
                
                {result.error && (
                  <p className="text-red-600 text-sm mb-2 m-0">
                    {result.error}
                  </p>
                )}
                
                {result.message && (
                  <p className="text-green-600 text-sm mb-2 m-0">
                    {result.message}
                  </p>
                )}

                {result.preview && result.preview.length > 0 && (
                  <div className="mt-3">
                    <h4 className="text-gray-900 font-medium text-sm mb-2">
                      Query Result Preview:
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-xs border border-gray-300 border-collapse">
                        <thead className="bg-gray-100">
                          <tr>
                            {Object.keys(result.preview[0]).map(key => (
                              <th key={key} className="border border-gray-300 p-2 text-left font-medium text-gray-600">
                                {key}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {result.preview.slice(0, 10).map((row, i) => (
                            <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                              {Object.values(row).map((value, j) => (
                                <td key={j} className="border border-gray-300 p-2 text-gray-900">
                                  {String(value)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {result.preview.length > 10 && (
                        <p className="text-xs text-gray-500 mt-1 m-0">
                          ... and {result.preview.length - 10} more rows
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );


}