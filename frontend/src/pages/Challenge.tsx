import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { challengeApi } from '../api/apiService.ts';
import type { Challenge, EvalRequest, EvalResponse } from '../api/api.ts';
import Editor from '@monaco-editor/react';

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

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Back to Home Button */}
      <div style={{ marginBottom: '2rem' }}>
        <Link 
          to="/" 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#f3f4f6',
            color: '#374151',
            textDecoration: 'none',
            borderRadius: '6px',
            border: '1px solid #d1d5db',
            fontSize: '0.875rem',
            fontWeight: '500',
            transition: 'background-color 0.2s'
          }}
        >
          ← Back to Challenges
        </Link>
      </div>
      
      {challenge && (
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: window.innerWidth >= 768 ? '1fr 1fr' : '1fr',
            gap: '3rem',
            alignItems: 'start',
            justifyContent: 'center',
            maxWidth: '1200px',
            margin: '0 auto'
          }}
        >
          {/* LEFT COLUMN – Challenge Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '8px', 
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', 
              padding: '1.5rem' 
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                marginBottom: '1rem' 
              }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: '#111827' }}>
                  #{challenge.id} – {challenge.title}
                </h1>
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  backgroundColor: challenge.difficulty === 'BASIC' ? '#f0fdf4' : 
                                 challenge.difficulty === 'EASY' ? '#f0fdf4' :
                                 challenge.difficulty === 'MEDIUM' ? '#fefce8' : '#fef2f2',
                  color: challenge.difficulty === 'BASIC' ? '#166534' : 
                         challenge.difficulty === 'EASY' ? '#166534' :
                         challenge.difficulty === 'MEDIUM' ? '#ca8a04' : '#dc2626'
                }}>
                  {challenge.difficulty}
                </span>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem', color: '#111827' }}>
                  Challenge Description
                </h3>
                <p style={{ color: '#111827', lineHeight: '1.6', margin: 0 }}>
                  {challenge.prompt}
                </p>
              </div>

              {challenge.hints && challenge.hints.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem', color: '#111827' }}>
                    Hints
                  </h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {challenge.hints.map((hint, index) => (
                      <li key={index} style={{ 
                        fontSize: '0.875rem', 
                        color: '#374151', 
                        display: 'flex', 
                        alignItems: 'flex-start',
                        marginBottom: '0.25rem'
                      }}>
                        <span style={{ color: '#3b82f6', marginRight: '0.5rem' }}>💡</span>
                        {hint}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {challenge.example_data && (
              <div style={{ 
                backgroundColor: 'white', 
                borderRadius: '8px', 
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', 
                padding: '1.5rem' 
              }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
                  Example Database
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontSize: '0.875rem' }}>
                  {Object.entries(challenge.example_data).map(([tableName, rows]: [string, any[]]) => (
                    <div key={tableName} style={{ border: '1px solid #d1d5db', borderRadius: '8px', overflow: 'hidden' }}>
                      <div style={{ backgroundColor: '#f3f4f6', padding: '1rem', borderBottom: '1px solid #d1d5db' }}>
                        <h3 style={{ 
                          fontWeight: '500', 
                          color: '#1f2937', 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '0.5rem',
                          margin: 0
                        }}>
                          <span style={{
                            backgroundColor: '#dbeafe',
                            color: '#1e40af',
                            fontSize: '0.75rem',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px'
                          }}>
                            TABLE
                          </span>
                          {tableName}
                          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                            ({rows.length} rows)
                          </span>
                        </h3>
                      </div>
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                          <thead style={{ backgroundColor: '#f9fafb' }}>
                            <tr>
                              {Object.keys(rows[0] || {}).map((col) => (
                                <th key={col} style={{
                                  borderRight: '1px solid #e5e7eb',
                                  padding: '0.75rem',
                                  textAlign: 'left',
                                  fontSize: '0.75rem',
                                  fontWeight: '500',
                                  color: '#6b7280',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.05em'
                                }}>
                                  {col}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody style={{ backgroundColor: 'white' }}>
                            {rows.map((row, idx) => (
                              <tr key={idx} style={{ borderTop: idx > 0 ? '1px solid #e5e7eb' : 'none' }}>
                                {Object.values(row).map((val, i) => (
                                  <td key={i} style={{
                                    borderRight: '1px solid #e5e7eb',
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#111827'
                                  }}>
                                    {val !== null && val !== undefined ? String(val) : 
                                      <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>NULL</span>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '8px', 
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', 
              padding: '1rem' 
            }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.75rem', color: '#111827' }}>
                Your SQL Query
              </h2>
              <div style={{ border: '1px solid #d1d5db', borderRadius: '4px', overflow: 'hidden' }}>
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
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <button
                  onClick={handleSubmit}
                  disabled={!query.trim()}
                  style={{
                    padding: '0.5rem 1.5rem',
                    backgroundColor: !query.trim() ? '#9ca3af' : '#2563eb',
                    color: 'white',
                    borderRadius: '4px',
                    border: 'none',
                    fontWeight: '500',
                    cursor: !query.trim() ? 'not-allowed' : 'pointer',
                    opacity: !query.trim() ? 0.5 : 1
                  }}
                >
                  Run Query
                </button>
                <button
                  onClick={() => setQuery('')}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#6b7280',
                    color: 'white',
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Results Section */}
            {result && (
              <div style={{
                borderRadius: '8px',
                padding: '1rem',
                border: `1px solid ${result.success ? '#bbf7d0' : '#fecaca'}`,
                backgroundColor: result.success ? '#f0fdf4' : '#fef2f2'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: result.success ? '#15803d' : '#dc2626'
                  }}>
                    {result.success ? '✅ Correct!' : '❌ Incorrect'}
                  </span>
                </div>
                
                {result.error && (
                  <p style={{ color: '#dc2626', fontSize: '0.875rem', marginBottom: '0.5rem', margin: 0 }}>
                    {result.error}
                  </p>
                )}
                
                {result.message && (
                  <p style={{ color: '#16a34a', fontSize: '0.875rem', marginBottom: '0.5rem', margin: 0 }}>
                    {result.message}
                  </p>
                )}

                {result.preview && result.preview.length > 0 && (
                  <div style={{ marginTop: '0.75rem' }}>
                    <h4 style={{ fontWeight: '500', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                      Query Result Preview:
                    </h4>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ 
                        minWidth: '100%', 
                        fontSize: '0.75rem', 
                        border: '1px solid #d1d5db',
                        borderCollapse: 'collapse'
                      }}>
                        <thead style={{ backgroundColor: '#f3f4f6' }}>
                          <tr>
                            {Object.keys(result.preview[0]).map(key => (
                              <th key={key} style={{
                                border: '1px solid #d1d5db',
                                padding: '0.5rem',
                                textAlign: 'left',
                                fontWeight: '500'
                              }}>
                                {key}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {result.preview.slice(0, 10).map((row, i) => (
                            <tr key={i} style={{ backgroundColor: i % 2 === 0 ? 'white' : '#f9fafb' }}>
                              {Object.values(row).map((value, j) => (
                                <td key={j} style={{
                                  border: '1px solid #d1d5db',
                                  padding: '0.5rem'
                                }}>
                                  {String(value)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {result.preview.length > 10 && (
                        <p style={{ 
                          fontSize: '0.75rem', 
                          color: '#6b7280', 
                          marginTop: '0.25rem',
                          margin: '0.25rem 0 0 0'
                        }}>
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
    </div>
  );


}