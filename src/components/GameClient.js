'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Container, Paper, Box, Typography, Grid, Button, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import API from '../lib/api';
import { toast } from 'react-toastify';

export default function GameClient({ gameId }) {
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const timerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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
      } catch (err) {
        console.error(err);
        toast.error('Could not load game. Returning to dashboard.');
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameId, router]);

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
    setSubmitting(true);
    try {
      const questionId = questions[index]._id;
      await API.post(`/game/answer/${gameId}/${questionId}`, { selected, timedOut });

      if (index + 1 >= questions.length) {
        router.push(`/result/${gameId}`);
        return;
      }

      setIndex((i) => i + 1);

    } catch (err) {
      console.error(err);
      toast.error(`Failed to submit answer: ${err?.response?.data?.message || err.message || 'Unknown error'}`);

      if (index + 1 >= questions.length) {
        router.push(`/result/${gameId}`);
        return;
      }

      setIndex((i) => i + 1);
    } finally {
      setSubmitting(false);
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

  if (loading) return (
    <Container sx={{ mt: 6, textAlign: 'center' }}>
      <CircularProgress />
      <Typography mt={2}>Loading game...</Typography>
    </Container>
  );

  if (!questions.length) return <Container><Typography mt={6}>No questions found</Typography></Container>;

  const q = questions[index];

  return (
    <Container maxWidth="md">
      <Paper sx={{ mt: 6, p: 3 }}>
        <Typography variant="h6">Question {index + 1} / {questions.length}</Typography>

        <Box display="flex" justifyContent="center" alignItems="center" gap={2} mt={2} mb={2}>
          <Box sx={{ p: 2, minWidth: 60, textAlign: 'center', border: '1px solid #ddd', borderRadius: 1 }}>
            <Typography variant="h5">{q.a}</Typography>
          </Box>
          <Box sx={{ p: 2, minWidth: 60, textAlign: 'center' }}>
            <Typography variant="h5">{q.op}</Typography>
          </Box>
          <Box sx={{ p: 2, minWidth: 60, textAlign: 'center', border: '1px solid #ddd', borderRadius: 1 }}>
            <Typography variant="h5">{q.b}</Typography>
          </Box>
        </Box>

        <Typography align="center" sx={{ mb: 2 }}>Time left: {timeLeft}s</Typography>

        <Box display="flex" justifyContent="center" mt={6}>
          <Grid container spacing={2} justifyContent="center">
            {q.choices.map((c, i) => (
              <Grid item key={i}>
                <Button
                  variant="outlined"
                  onClick={() => handleChoice(c)}
                  disabled={submitting}
                >
                  {formatNumber(c)}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}
