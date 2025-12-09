'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setLoading } from '../../store/loadingSlice';
import API from '../../lib/api';
import { toast } from 'react-toastify';
import Image from 'next/image';

export default function Dashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (u) setUser(JSON.parse(u));
    dispatch(setLoading(false));
  }, [dispatch]);

  const startGame = async () => {
    dispatch(setLoading(true));
    try {
      const res = await API.post('/game/start');
      const gameId = res.data.gameId;
      if (gameId) {
        router.push(`/game/${gameId}`);
      } else {
        toast.error('Failed to start game');
        dispatch(setLoading(false));
      }
    } catch (err) {
      console.error(err);
      toast.error('Error starting game');
      dispatch(setLoading(false));
    }
  };

  function logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    router.push('/login');
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto pt-8">
        {/* Header with Buttons */}
        <div className="flex justify-between mb-8">
          <button
            onClick={() => {
              dispatch(setLoading(true));
              router.push('/');
            }}
            className="px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            🏠 Home
          </button>
          <div className="flex gap-3">
            <button
              onClick={() => {
                dispatch(setLoading(true));
                router.push('/profile/edit');
              }}
              className="px-6 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              ✏️ Edit Profile
            </button>
            <button
              onClick={logout}
              className="px-6 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Profile Card */}
        <div className="glass-effect rounded-3xl p-8 mb-8 text-center transform hover:scale-[1.02] transition-transform duration-300">
          <div className="relative inline-block mb-4">
            {user?.profilePictureUrl ? (
              <Image
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${user.profilePictureUrl}`}
                alt="Profile"
                width={120}
                height={120}
                className="rounded-full border-4 border-purple-300 shadow-xl"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-4xl font-bold border-4 border-purple-300 shadow-xl">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
            )}
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full border-4 border-white animate-pulse"></div>
          </div>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            {user ? `${user.firstName} ${user.lastName}` : 'Player'}
          </h1>
          <p className="text-gray-600 text-lg">{user?.email}</p>
        </div>

        {/* Game Stats Grid */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-effect rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300">
            <div className="text-5xl mb-2">🎮</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">0</h3>
            <p className="text-gray-600">Games Played</p>
          </div>
          
          <div className="glass-effect rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300">
            <div className="text-5xl mb-2">🏆</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">0</h3>
            <p className="text-gray-600">Wins</p>
          </div>
          
          <div className="glass-effect rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300">
            <div className="text-5xl mb-2">⭐</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">0</h3>
            <p className="text-gray-600">High Score</p>
          </div>
        </div> */}

        {/* Start Game Button */}
        <div className="glass-effect rounded-3xl p-12 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Challenge Yourself?</h2>
          <p className="text-gray-600 mb-8 text-lg">Test your math skills and compete for the highest score!</p>
          
          <button
            onClick={startGame}
            className="btn-primary text-xl px-12 py-4 relative overflow-hidden group"
          >
            <span className="relative z-10">
              <span className="flex items-center justify-center">
                🚀 Start New Game
              </span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
