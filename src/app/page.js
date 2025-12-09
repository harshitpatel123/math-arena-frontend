'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setLoading } from '../store/loadingSlice';

export default function LandingPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const u = localStorage.getItem('user');
    setLoggedIn(!!token);
    if (u) setUser(JSON.parse(u));
    dispatch(setLoading(false));
  }, [dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="mb-12">
          <div className="text-8xl mb-6 animate-bounce">🧠✨</div>
          <h1 className="text-7xl md:text-8xl font-black mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              Math Arena
            </span>
          </h1>
          <p className="text-2xl md:text-3xl text-gray-700 font-semibold mb-4">
            Fast-paced math challenges
          </p>
          <p className="text-xl text-gray-600">
            ⚡ 10 questions per round • ⏱️ 30 seconds each • 🏆 Beat your high score
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass-effect rounded-2xl p-6 transform hover:scale-105 transition-all duration-300">
            <div className="text-5xl mb-3">🚀</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Quick Rounds</h3>
            <p className="text-gray-600">Complete challenges in minutes</p>
          </div>
          
          <div className="glass-effect rounded-2xl p-6 transform hover:scale-105 transition-all duration-300">
            <div className="text-5xl mb-3">🎯</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Track Progress</h3>
            <p className="text-gray-600">Monitor your improvement</p>
          </div>
          
          <div className="glass-effect rounded-2xl p-6 transform hover:scale-105 transition-all duration-300">
            <div className="text-5xl mb-3">🏅</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Compete</h3>
            <p className="text-gray-600">Challenge yourself daily</p>
          </div>
        </div>

        {/* CTA */}
        <div className="glass-effect rounded-3xl p-8">
          {!loggedIn ? (
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Ready to Start?</h2>
              <button
                onClick={() => {
                  dispatch(setLoading(true));
                  router.push('/login');
                }}
                className="btn-primary text-xl px-12 py-4"
              >
                🔥 Get Started
              </button>
            </div>
          ) : (
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Welcome back{user ? `, ${user.firstName}` : ''}! 🎉
              </h2>
              <button
                onClick={() => {
                  dispatch(setLoading(true));
                  router.push('/dashboard');
                }}
                className="btn-primary text-xl px-12 py-4"
              >
                🎮 Go to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
