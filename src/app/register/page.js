'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setLoading } from '../../store/loadingSlice';
import API from '../../lib/api';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { uploadToS3 } from '../../lib/s3Upload';

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ mode: 'onSubmit' });
  const [profileFile, setProfileFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    dispatch(setLoading(false));
  }, [dispatch]);

  function handleFileChange(e) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (!file.type.startsWith('image/')) {
        toast.error('Only image files are allowed');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 2MB');
        return;
      }

      setProfileFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  }

  function handleDiscardFile() {
    setProfileFile(null);
    setPreviewUrl(null);
  }

  const onSubmit = async (formData) => {
    dispatch(setLoading(true));
    try {
      const res = await API.post('/auth/register', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        birthdate: formData.birthdate || ''
      });
      const accessToken = res.data.accessToken;
      if (!accessToken) {
        toast.error('Registration failed due to server error');
        dispatch(setLoading(false));
        return;
      }
      
      localStorage.setItem('accessToken', accessToken);
      let user = res.data.user;
      
      if (profileFile && user) {
        try {
          const profilePictureUrl = await uploadToS3(profileFile);
          const updateRes = await API.put('/auth/profile', { profilePictureUrl });
          user = updateRes.data.user;
        } catch (error) {
          console.error('Failed to upload profile picture:', error);
        }
      }
      
      if (user) localStorage.setItem('user', JSON.stringify(user));
      toast.success('Registration successful');
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      toast.error('Registration failed');
      dispatch(setLoading(false));
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="glass-effect rounded-3xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Join Math Arena
            </h1>
            <p className="text-gray-600">Create your account and start competing</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">First Name *</label>
                <input
                  type="text"
                  className={`input-field ${errors.firstName ? 'border-red-500' : ''}`}
                  placeholder="John"
                  {...register('firstName', { required: 'First name required' })}
                />
                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name *</label>
                <input
                  type="text"
                  className={`input-field ${errors.lastName ? 'border-red-500' : ''}`}
                  placeholder="Doe"
                  {...register('lastName', { required: 'Last name required' })}
                />
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                placeholder="john@example.com"
                {...register('email', { required: 'Email required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password *</label>
              <input
                type="password"
                className={`input-field ${errors.password ? 'border-red-500' : ''}`}
                placeholder="Min 6 characters"
                {...register('password', { required: 'Password required', minLength: { value: 6, message: 'Min 6 chars' } })}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

            {/* Phone & Birthdate */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  className={`input-field ${errors.phoneNumber ? 'border-red-500' : ''}`}
                  placeholder="9876543210"
                  {...register('phoneNumber', { required: 'Phone number required', pattern: { value: /^[6-9]\d{9}$/, message: 'Invalid phone' } })}
                />
                {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Birthdate</label>
                <input
                  type="date"
                  className="input-field"
                  {...register('birthdate')}
                />
              </div>
            </div>

            {/* Profile Picture */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Profile Picture</label>
              {previewUrl ? (
                <div className="relative inline-block">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    width={100}
                    height={100}
                    className="rounded-xl object-cover border-4 border-purple-200"
                  />
                  <button
                    type="button"
                    onClick={handleDiscardFile}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all duration-300">
                  <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-600">Click to upload image</p>
                  </div>
                  <input hidden accept="image/*" type="file" onChange={handleFileChange} />
                </label>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary flex-1 relative"
              >
                {isSubmitting && (
                  <span className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                )}
                <span className={isSubmitting ? 'invisible' : ''}>Create Account</span>
              </button>
              
              <button
                type="button"
                onClick={() => {
                  dispatch(setLoading(true));
                  router.push('/login');
                }}
                className="btn-secondary flex-1"
              >
                Back to Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
