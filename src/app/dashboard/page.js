'use client';

import React, { useEffect, useState } from 'react';
import { Container, Typography, Avatar, Button, Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import API from '../../lib/api';
import { toast } from 'react-toastify';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [gameLoading, setGameLoading] = useState(false);

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (u) setUser(JSON.parse(u));
  }, []);

  const startGame = async () => {
    setGameLoading(true);
    try {
      const res = await API.post('/game/start');
      const gameId = res.data.gameId;
      if (gameId) router.push(`/game/${gameId}`);
      else toast.error('Failed to start game');
    } catch (err) {
      console.error(err);
      toast.error('Error starting game');
    } finally {
      setGameLoading(false);
    }
  };

  function logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    router.push('/login');
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
      <Avatar
        src={user?.profilePictureUrl ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${user.profilePictureUrl}` : undefined}
        sx={{ width: 96, height: 96, margin: '0 auto' }}
      />
      <Typography variant="h5" mt={2}>{user ? `${user.firstName} ${user.lastName}` : 'Player'}</Typography>
      <Typography variant="body2" color="text.secondary">{user?.email}</Typography>

      <Box mt={4} display="flex" justifyContent="center" gap={2}>
        <Button variant="contained" onClick={startGame} disabled={gameLoading}>
          {gameLoading ? 'Starting...' : 'Start Game'}
        </Button>
        <Button variant="outlined" color="error" onClick={logout}>
          Logout
        </Button>
      </Box>
    </Container>
  );
}
