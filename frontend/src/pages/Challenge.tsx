import { useParams } from 'react-router-dom';
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
    <div className="p-6 max-w-4xl mx-auto">
      {challenge && (
        <>
          <h1 className="text-2xl font-bold mb-2">{challenge.title}</h1>
          <p className="mb-4 text-gray-700">{challenge.prompt}</p>
          <Editor
            height="200px"
            language="sql"
            theme="vs-dark"
            value={query}
            onChange={(v) => setQuery(v || '')}
          />
          <button
            onClick={handleSubmit}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Submit
          </button>
          {result && (
            <div className="mt-4">
              {result.success ? (
                <div className="text-green-700 font-semibold">✅ Correct!</div>
              ) : (
                <div className="text-red-700 font-semibold">❌ {result.error}</div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}