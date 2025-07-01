import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { challengeApi } from '../api/apiService.ts'
import type { Challenge } from '../api/api.ts';
import Footer from '../components/Footer.tsx';

export default function Home() {
    const [challenges, setChallenges] = useState<Challenge[]>([]);

    const getDifficultyStyles = (difficulty: string) => {
        switch (difficulty) {
            case 'BASIC':
                return 'bg-blue-50 text-blue-700 border border-blue-200';
            case 'EASY':
                return 'bg-green-50 text-green-700 border border-green-200';
            case 'MEDIUM':
                return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
            default:
                return 'bg-red-50 text-red-700 border border-red-200';
        }
    };

    const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');
    
    useEffect(() => {
        challengeApi.getChallenges().then(setChallenges);
    }, []);

    return (
        <>
            <div className="p-6 max-w-xl mx-auto">
                <h1 className="text-2xl font-bold mb-4">🏋️ SQLGym Challenges</h1>
                <div className="flex gap-2 mb-4">
                    {['ALL', 'BASIC', 'EASY', 'MEDIUM', 'HARD'].map((level) => (
                        <button
                        key={level}
                        onClick={() => setSelectedDifficulty(level)}
                        className={`text-sm px-3 py-1 rounded border ${
                            selectedDifficulty === level
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        >
                        {level}
                        </button>
                    ))}
                </div>
                <ul className="space-y-3">
                    {challenges.filter(c => selectedDifficulty === 'ALL' || c.difficulty === selectedDifficulty).map(c => (
                    <li key={c.id} className="border p-4 rounded hover:bg-gray-100">
                        <Link to={`/challenge/${c.id}`} className="flex justify-between items-center">
                            <div>
                            <h2 className="text-lg font-semibold">{c.title}</h2>
                            <span className={`text-xs font-semibold px-2 py-1 rounded ${getDifficultyStyles(c.difficulty)}`}>
                                {c.difficulty}
                            </span>
                            </div>
                            <span className="text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </span>
                        </Link>
                    </li>
                    ))}
                </ul>
            </div>
            <Footer />
        </>
    );
    
}