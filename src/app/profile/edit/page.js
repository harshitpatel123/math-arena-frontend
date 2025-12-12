'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setLoading } from '../../../store/loadingSlice';
import API from '../../../lib/api';
import { toast } from 'react-toastify';
import { uploadToS3 } from '../../../lib/s3Upload';

export default function EditProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm({ mode: 'onSubmit' });
  const [user, setUser] = useState(null);
  const [profileFile, setProfileFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (!u) {
      router.push('/login');
      return;
    }
    const userData = JSON.parse(u);
    setUser(userData);
    setValue('firstName', userData.firstName);
    setValue('lastName', userData.lastName);
    setValue('email', userData.email);
    setValue('phoneNumber', userData.phoneNumber);
    setValue('birthdate', userData.birthdate ? userData.birthdate.split('T')[0] : '');
    dispatch(setLoading(false));
  }, [router, setValue, dispatch]);

  function handleFileChange(e) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (!file.type.startsWith('image/')) {
        toast.error('Only image files are allowed');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
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
      let profilePictureUrl = user.profilePictureUrl;
      
      if (profileFile) {
        try {
          profilePictureUrl = await uploadToS3(profileFile);
        } catch (error) {
          toast.error('Failed to upload profile picture');
          dispatch(setLoading(false));
          return;
        }
      }

      const res = await API.put('/auth/profile', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        birthdate: formData.birthdate || '',
        profilePictureUrl
      });
      
      if (res.data.user) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setUser(res.data.user);
      }
      
      toast.success('Profile updated successfully');
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to update profile');
      dispatch(setLoading(false));
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen p-4 py-12 relative">

      {/* Content */}
      <div className="relative max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => {
              dispatch(setLoading(true));
              router.push('/dashboard');
            }}
            className="px-6 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            ← Back
          </button>
        </div>

        {/* Edit Profile Card */}
        <div className="glass-effect rounded-3xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Edit Profile
            </h1>
            <p className="text-gray-600">Update your account information</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Profile Picture */}
            <div className="text-center mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Profile Picture</label>
              {previewUrl ? (
                <div className="relative inline-block">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-32 h-32 rounded-full object-cover border-4 border-purple-200"
                  />
                  <button
                    type="button"
                    onClick={handleDiscardFile}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                  >
                    ✕
                  </button>
                </div>
              ) : user?.profilePictureUrl && !imageError ? (
                <div className="relative inline-block">
                  <img
                    src={user.profilePictureUrl}
                    alt="Current"
                    className="w-32 h-32 rounded-full object-cover border-4 border-purple-200"
                    onError={() => setImageError(true)}
                  />
                  <label className="absolute -bottom-2 -right-2 bg-purple-500 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-purple-600 transition-colors shadow-lg cursor-pointer">
                    📷
                    <input hidden accept="image/*" type="file" onChange={handleFileChange} />
                  </label>
                </div>
              ) : (
                <label className="flex items-center justify-center w-32 h-32 mx-auto border-2 border-dashed border-gray-300 rounded-full cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all duration-300">
                  <div className="text-center">
                    <div className="text-4xl mb-1">📷</div>
                    <p className="text-xs text-gray-600">Upload</p>
                  </div>
                  <input hidden accept="image/*" type="file" onChange={handleFileChange} />
                </label>
              )}
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">First Name *</label>
                <input
                  type="text"
                  className={`input-field ${errors.firstName ? 'border-red-500' : ''}`}
                  {...register('firstName', { required: 'First name required' })}
                />
                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name *</label>
                <input
                  type="text"
                  className={`input-field ${errors.lastName ? 'border-red-500' : ''}`}
                  {...register('lastName', { required: 'Last name required' })}
                />
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
              </div>
            </div>

            {/* Email (Read-only) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                className="input-field bg-gray-100 cursor-not-allowed"
                {...register('email')}
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
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
                <span className={isSubmitting ? 'invisible' : ''}>💾 Save Changes</span>
              </button>
              
              <button
                type="button"
                onClick={() => {
                  dispatch(setLoading(true));
                  router.push('/dashboard');
                }}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
