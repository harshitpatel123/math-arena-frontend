'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setLoading } from '../store/loadingSlice';
import API from '../lib/api';
import { toast } from 'react-toastify';

export default function ResultClient({ gameId }) {
	const router = useRouter();
	const dispatch = useDispatch();
	const [questions, setQuestions] = useState([]);
	const [score, setScore] = useState(0);
	const [loading, setLoadingLocal] = useState(true);

	useEffect(() => {
		async function fetchResult() {
			try {
				const res = await API.get(`/game/result/${gameId}`);
				setQuestions(res.data.game.questions || []);
				setScore(res.data.score ?? (res.data.game.questions.filter(q => q.isCorrect).length));
				dispatch(setLoading(false));
			} catch (err) {
				console.error(err);
				toast.error('Failed to load result');
				router.push('/dashboard');
			} finally {
				setLoadingLocal(false);
			}
		}
		fetchResult();
	}, [gameId, router, dispatch]);

	function fmt(n) {
		if (n === null || n === undefined) return '—';
		return Number.isFinite(n) && Math.floor(n) !== n ? n.toFixed(2) : String(n);
	}

	function logout() {
		localStorage.removeItem('accessToken');
		localStorage.removeItem('user');
		router.push('/login');
	}

	if (loading) return null;

	const percentage = Math.round((score / questions.length) * 100);
	const isPerfect = score === questions.length;
	const isGood = percentage >= 70;

	return (
		<div className="min-h-screen p-4">
			<div className="max-w-4xl mx-auto pt-6">
				{/* Score Card */}
				<div className="glass-effect rounded-2xl p-6 mb-6 text-center">
					<div className="text-4xl mb-3 animate-bounce">
						{isPerfect ? '🏆' : isGood ? '🎉' : '💪'}
					</div>
					<h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-3">
						{isPerfect ? 'Perfect Score!' : isGood ? 'Great Job!' : 'Keep Practicing!'}
					</h1>
					<div className="flex items-center justify-center gap-3 mb-3">
						<div className="text-5xl font-bold text-gray-800">{score}</div>
						<div className="text-3xl text-gray-400">/</div>
						<div className="text-4xl font-bold text-gray-600">{questions.length}</div>
					</div>
					<div className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full text-lg font-bold shadow-lg">
						{percentage}% Accuracy
					</div>
				</div>

				{/* Questions Review */}
				<div className="glass-effect rounded-2xl p-6 mb-6">
					<h2 className="text-2xl font-bold text-gray-800 mb-4">Question Review</h2>
					
					<div className="space-y-3">
						{questions.map((q, idx) => (
							<div 
								key={idx} 
								className={`p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-md ${
									q.isCorrect 
										? 'bg-green-50 border-green-300' 
										: q.timedOut 
										? 'bg-gray-50 border-gray-300' 
										: 'bg-red-50 border-red-300'
								}`}
							>
								<div className="flex items-center justify-between flex-wrap gap-3">
									<div className="flex items-center gap-3">
										<div className="text-lg font-bold text-gray-600 bg-white rounded-full w-9 h-9 flex items-center justify-center shadow">
											{idx + 1}
										</div>
										<div className="text-base font-semibold text-gray-800">
											{q.a} {q.op} {q.b} = {fmt(q.correctAnswer)}
										</div>
									</div>
									
									<div className="flex items-center gap-4">
										<div className="text-center">
											<div className="text-xs text-gray-600 mb-1">Your Answer</div>
											<div className={`text-base font-bold ${
												q.isCorrect ? 'text-green-600' : q.timedOut ? 'text-gray-500' : 'text-red-600'
											}`}>
												{q.timedOut ? 'No Answer' : fmt(q.selected)}
											</div>
										</div>
										
										<div className={`px-3 py-1 rounded-full text-sm font-bold text-white shadow ${
											q.isCorrect 
												? 'bg-green-500' 
												: q.timedOut 
												? 'bg-gray-500' 
												: 'bg-red-500'
										}`}>
											{q.timedOut ? '⏱️ Timeout' : q.isCorrect ? '✅ Correct' : '❌ Wrong'}
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Action Buttons */}
				<div className="flex gap-3 justify-center">
					<button
						onClick={() => {
							dispatch(setLoading(true));
							router.push('/dashboard');
						}}
						className="btn-primary px-6 py-3"
					>
						🏠 Back to Dashboard
					</button>
					<button
						onClick={logout}
						className="btn-secondary px-6 py-3"
					>
						Logout
					</button>
				</div>
			</div>
		</div>
	);
}
