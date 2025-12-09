'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setLoading } from '../../store/loadingSlice';
import API from '../../lib/api';
import { toast } from 'react-toastify';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    dispatch(setLoading(false));
  }, [dispatch]);

  const onSubmit = async (data) => {
    dispatch(setLoading(true));
    try {
      const res = await API.post('/auth/login', data);
      const accessToken = res.data.accessToken || res.data.token || res.data.token;
      if (!accessToken) {
        toast.error('Login Failed due to server error');
        dispatch(setLoading(false));
        return;
      }
      localStorage.setItem('accessToken', accessToken);
      if (res.data.user) localStorage.setItem('user', JSON.stringify(res.data.user));
      toast.success('Login successful');
      router.push('/dashboard');
    } catch (err) {
      const message = err.response?.data?.message;
      if (message === 'Invalid credentials') {
        setLoginError(message);
      } else {
        console.error(err);
        toast.error('Login failed');
      }
      dispatch(setLoading(false));
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="glass-effect rounded-3xl p-8 shadow-2xl transform hover:scale-[1.02] transition-transform duration-300">
          {/* Close Button */}
          <button
            onClick={() => router.push('/')}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors text-gray-600 hover:text-gray-800"
          >
            ✕
          </button>
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600">Sign in to continue your math journey</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                className={`input-field ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : ''}`}
                placeholder="Enter your email"
                {...register('email', {
                  required: 'Email required',
                  pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' },
                  onChange: () => setLoginError('')
                })}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                className={`input-field ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : ''}`}
                placeholder="Enter your password"
                {...register('password', {
                  required: 'Password required',
                  minLength: { value: 6, message: 'Min 6 chars' },
                  onChange: () => setLoginError('')
                })}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

            {/* Error Alert */}
            {loginError && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg animate-pulse">
                <p className="text-red-700 text-sm font-medium">{loginError}</p>
              </div>
            )}

            {/* Buttons */}
            <div className="space-y-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full relative"
              >
                {isSubmitting && (
                  <span className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                )}
                <span className={isSubmitting ? 'invisible' : ''}>Sign In</span>
              </button>
              
              <button
                type="button"
                onClick={() => {
                  dispatch(setLoading(true));
                  router.push('/register');
                }}
                className="btn-secondary w-full"
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
