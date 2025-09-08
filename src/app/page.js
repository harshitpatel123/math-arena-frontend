'use client';

import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const u = localStorage.getItem('user');
    setLoggedIn(!!token);
    if (u) setUser(JSON.parse(u));
  }, []);

  return (
    <Container sx={{ textAlign: 'center', mt: 12 }}>
      <Typography variant="h3" gutterBottom>Math Arena</Typography>
      <Typography variant="subtitle1" gutterBottom>Fast-paced math rounds — 10 questions per round</Typography>

      <Box mt={4}>
        {!loggedIn ? (
          <Button variant="contained" size="large" onClick={() => router.push('/login')}>
            Login
          </Button>
        ) : (
          <div>
            <Typography gutterBottom>Welcome back{user ? `, ${user.firstName}` : ''}!</Typography>
            <Button variant="contained" size="large" onClick={() => router.push('/dashboard')}>
              Go to Dashboard
            </Button>
          </div>
        )}
      </Box>
    </Container>
  );
}
