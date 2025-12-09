'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setLoading } from '../store/loadingSlice';
import API from '../lib/api';
import { toast } from 'react-toastify';

export default function GameClient({ gameId }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const timerRef = useRef(null);
  const [loading, setLoadingLocal] = useState(true);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const res = await API.get(`/game/questions/${gameId}`);
        const qs = res.data?.game?.questions;
        if (!qs || !qs.length) {
          toast.error('No questions found. Returning to dashboard.');
          router.push('/dashboard');
          return;
        }
        setQuestions(qs);
        dispatch(setLoading(false));
      } catch (err) {
        console.error(err);
        toast.error('Could not load game. Returning to dashboard.');
        router.push('/dashboard');
      } finally {
        setLoadingLocal(false);
      }
    };

    fetchGame();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameId, router, dispatch]);

  useEffect(() => {
    if (loading || questions.length === 0) return;

    setTimeLeft(30);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
            handleTimeout();
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [index, loading, questions]);

  function formatNumber(n) {
    if (n === undefined || n === null) return '—';
    return Number.isFinite(n) && Math.floor(n) !== n ? n.toFixed(2) : String(n);
  }

  async function submitAnswer(selected, timedOut = false) {
    // dispatch(setLoading(true));
    try {
      const questionId = questions[index]._id;
      await API.post(`/game/answer/${gameId}/${questionId}`, { selected, timedOut });

      if (index + 1 >= questions.length) {
        router.push(`/result/${gameId}`);
        dispatch(setLoading(true));
        return;
      }

      setIndex((i) => i + 1);
      // dispatch(setLoading(false));

    } catch (err) {
      console.error(err);
      toast.error(`Failed to submit answer: ${err?.response?.data?.message || err.message || 'Unknown error'}`);

      if (index + 1 >= questions.length) {
        router.push(`/result/${gameId}`);
        return;
      }

      setIndex((i) => i + 1);
      // dispatch(setLoading(false));
    }
  }

  function handleChoice(choice) {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    submitAnswer(choice, false);
  }

  function handleTimeout() {
    submitAnswer(null, true);
  }

  if (loading) return null;

  if (!questions.length) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-xl text-gray-700">No questions found</p>
    </div>
  );

  const q = questions[index];

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto pt-8">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-700">Question {index + 1} of {questions.length}</span>
            <span className="text-sm font-semibold text-gray-700">{Math.round((index / questions.length) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 ease-out"
              style={{ width: `${(index / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Timer */}
        <div className="glass-effect rounded-2xl p-6 mb-6 text-center">
          <div className="relative inline-block">
            <svg className="transform -rotate-90 w-32 h-32">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#e5e7eb"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="url(#gradient)"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 56}`}
                strokeDashoffset={`${2 * Math.PI * 56 * (1 - timeLeft / 30)}`}
                className="transition-all duration-1000 ease-linear"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#9333ea" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-4xl font-bold ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-gray-800'}`}>
                {timeLeft}
              </span>
            </div>
          </div>
          <p className="text-gray-600 mt-2">seconds remaining</p>
        </div>

        {/* Question Card */}
        <div className="glass-effect rounded-3xl p-8 mb-6 transform hover:scale-[1.01] transition-transform duration-300">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Solve the Problem</h2>

          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-2xl p-6 min-w-[100px] text-center shadow-xl transform hover:scale-110 transition-transform duration-300">
              <span className="text-5xl font-bold">{q.a}</span>
            </div>

            <div className="text-6xl font-bold text-purple-600 animate-pulse">
              {q.op}
            </div>

            <div className="bg-gradient-to-br from-purple-400 to-purple-600 text-white rounded-2xl p-6 min-w-[100px] text-center shadow-xl transform hover:scale-110 transition-transform duration-300">
              <span className="text-5xl font-bold">{q.b}</span>
            </div>

            <div className="text-6xl font-bold text-gray-400">
              =
            </div>

            <div className="bg-gradient-to-br from-pink-400 to-pink-600 text-white rounded-2xl p-6 min-w-[100px] text-center shadow-xl">
              <span className="text-5xl font-bold">?</span>
            </div>
          </div>
        </div>

        {/* Answer Choices */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {q.choices.map((c, i) => (
            <button
              key={i}
              onClick={() => handleChoice(c)}
              className="glass-effect rounded-2xl p-8 text-3xl font-bold text-gray-800 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white transform hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-2xl"
            >
              {formatNumber(c)}
            </button>
          ))}
        </div>


      </div>
    </div>
  );
}
