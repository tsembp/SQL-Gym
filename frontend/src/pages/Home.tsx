import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { challengeApi } from '../api/apiService.ts'
import type { Challenge } from '../api/api.ts';

export default function Home() {
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    
    useEffect(() => {
        challengeApi.getChallenges().then(setChallenges);
    }, []);

    return (
        <div className="p-6 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">SQLGym Challenges</h1>
        <ul className="space-y-3">
            {challenges.map((c: any) => (
            <li key={c.id} className="border p-4 rounded hover:bg-gray-100">
                <Link to={`/challenge/${c.id}`}>
                <h2 className="text-lg font-semibold">{c.title}</h2>
                <p className="text-sm text-gray-600">{c.difficulty}</p>
                </Link>
            </li>
            ))}
        </ul>
        </div>
    );
    
}