'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Container, Box, TextField, Button, Typography, IconButton } from '@mui/material';
import { useRouter } from 'next/navigation';
import API from '../../lib/api';
import { toast } from 'react-toastify';
import { Close } from '@mui/icons-material';
import Image from 'next/image';

export default function RegisterPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [profileFile, setProfileFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

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
    try {
      const fd = new FormData();
      fd.append('firstName', formData.firstName);
      fd.append('lastName', formData.lastName);
      fd.append('email', formData.email);
      fd.append('password', formData.password);
      fd.append('phoneNumber', formData.phoneNumber || '');
      fd.append('birthdate', formData.birthdate || '');
      if (profileFile) fd.append('profilePicture', profileFile);

      const res = await API.post('/auth/register', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      const accessToken = res.data.accessToken;
      if (!accessToken) {
        toast.error('Registration failed due to server error');
        return;
      }
      localStorage.setItem('accessToken', accessToken);
      if (res.data.user) localStorage.setItem('user', JSON.stringify(res.data.user));
      toast.success('Registration successful');
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      toast.error('Registration failed');
    }
  }

  return (
    <Container maxWidth="sm">
      <Box mt={6} component="form" onSubmit={handleSubmit(onSubmit)}>
        <Typography variant="h4" mb={2}>Register</Typography>

        <TextField
          label="First Name *"
          fullWidth
          margin="normal"
          {...register('firstName', { required: 'First name required' })}
          error={!!errors.firstName}
          helperText={errors.firstName?.message}
        />

        <TextField
          label="Last Name *"
          fullWidth
          margin="normal"
          {...register('lastName', { required: 'Last name required' })}
          error={!!errors.lastName}
          helperText={errors.lastName?.message}
        />

        <TextField
          label="Email *"
          fullWidth
          margin="normal"
          {...register('email', { required: 'Email required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })}
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        <TextField
          label="Password *"
          type="password"
          fullWidth
          margin="normal"
          {...register('password', { required: 'Password required', minLength: { value: 6, message: 'Min 6 chars' } })}
          error={!!errors.password}
          helperText={errors.password?.message}
        />

        <TextField
          label="Phone Number *"
          fullWidth
          margin="normal"
          {...register('phoneNumber', { pattern: { value: /^[6-9]\d{9}$/, message: 'Invalid phone' } })}
          error={!!errors.phoneNumber}
          helperText={errors.phoneNumber?.message}
        />

        <TextField
          label="Birthdate"
          type="date"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          {...register('birthdate')}
        />

        <Box mt={2} display="flex" alignItems="center" gap={2}>
          {previewUrl ? (
            <Box position="relative">
              <Image
                src={previewUrl}
                alt="Preview"
                width={80}
                height={80}
                style={{ objectFit: 'cover', borderRadius: 4 }}
              />
              <IconButton
                size="small"
                onClick={handleDiscardFile}
                sx={{ position: 'absolute', top: -10, right: -10, background: 'white' }}
              >
                <Close fontSize="small" />
              </IconButton>
            </Box>
          ) : (
            <Button variant="outlined" component="label">
              Upload Profile Picture
              <input hidden accept="image/*" type="file" onChange={handleFileChange} />
            </Button>
          )}
        </Box>

        <Box mt={3} display="flex" gap={2}>
          <Button type="submit" variant="contained" disabled={isSubmitting}>Register</Button>
          <Button variant="text" onClick={() => router.push('/login')}>Back</Button>
        </Box>
      </Box>
    </Container>
  );
}
