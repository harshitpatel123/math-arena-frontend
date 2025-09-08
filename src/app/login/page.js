'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Container, Box, TextField, Button, Typography, Alert } from '@mui/material';
import { useRouter } from 'next/navigation';
import API from '../../lib/api';
import { toast } from 'react-toastify';

export default function LoginPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [loginError, setLoginError] = useState('');

  const onSubmit = async (data) => {
    try {
      const res = await API.post('/auth/login', data);
      const accessToken = res.data.accessToken || res.data.token || res.data.token;
      if (!accessToken) {
        toast.error('Login Failed due to server error');
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
    }
  }

  return (
    <Container maxWidth="sm">
      <Box mt={10} component="form" onSubmit={handleSubmit(onSubmit)}>
        <Typography variant="h4" mb={2}>Login</Typography>

        <TextField
          label="Email"
          fullWidth
          margin="normal"
          {...register('email', {
            required: 'Email required',
            pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' },
            onChange: () => setLoginError('')
          })}
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          {...register('password', {
            required: 'Password required',
            minLength: { value: 6, message: 'Min 6 chars' },
            onChange: () => setLoginError('')
          })}
          error={!!errors.password}
          helperText={errors.password?.message}
        />

        {loginError && <Alert severity="error" sx={{ mb: 2 }}>{loginError}</Alert>}

        <Box mt={2} display="flex" gap={2}>
          <Button type="submit" variant="contained" disabled={isSubmitting}>Login</Button>
          <Button variant="outlined" onClick={() => router.push('/register')}>Register</Button>
        </Box>
      </Box>
    </Container>
  );
}
