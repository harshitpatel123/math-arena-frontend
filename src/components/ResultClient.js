'use client';

import React, { useEffect, useState } from 'react';
import { Container, Paper, Typography, Box, Button, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import API from '../lib/api';
import { toast } from 'react-toastify';

export default function ResultClient({ gameId }) {
	const router = useRouter();
	const [questions, setQuestions] = useState([]);
	const [score, setScore] = useState(0);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchResult() {
			try {
				const res = await API.get(`/game/result/${gameId}`);
				setQuestions(res.data.game.questions || []);
				setScore(res.data.score ?? (res.data.game.questions.filter(q => q.isCorrect).length));
			} catch (err) {
				console.error(err);
				toast.error('Failed to load result');
				router.push('/dashboard');
			} finally {
				setLoading(false);
			}
		}
		fetchResult();
	}, [gameId, router]);

	function fmt(n) {
		if (n === null || n === undefined) return '—';
		return Number.isFinite(n) && Math.floor(n) !== n ? n.toFixed(2) : String(n);
	}

	function logout() {
		localStorage.removeItem('accessToken');
		localStorage.removeItem('user');
		router.push('/login');
	}

	if (loading) return (
		<Container sx={{ mt: 6, textAlign: 'center' }}>
			<CircularProgress />
			<Typography mt={2}>Loading result...</Typography>
		</Container>
	);

	return (
		<Container maxWidth="md">
			<Paper sx={{ mt: 6, p: 3 }}>
				<Typography variant="h5">Round Result</Typography>
				<Typography variant="subtitle1" sx={{ mt: 1 }}> Score : {score} / {questions.length}</Typography>

				<Box mt={3}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>#</TableCell>
								<TableCell>Equation</TableCell>
								<TableCell>Correct</TableCell>
								<TableCell>Selected</TableCell>
								<TableCell>Outcome</TableCell>
							</TableRow>
						</TableHead>

						<TableBody>
							{questions.map((q, idx) => (
								<TableRow key={idx}>
									<TableCell>{idx + 1}</TableCell>
									<TableCell>{q.a} {q.op} {q.b} = {fmt(q.correctAnswer)}</TableCell>
									<TableCell>{fmt(q.correctAnswer)}</TableCell>
									<TableCell>{fmt(q.selected)}</TableCell>
									<TableCell>{q.timedOut ? 'Timed out' : (q.isCorrect ? 'Correct' : 'Wrong')}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</Box>

				<Box mt={3} display="flex" gap={2}>
					<Button variant="contained" onClick={() => router.push('/dashboard')}>Back to Dashboard</Button>
					<Button variant="outlined" onClick={logout}>Logout</Button>
				</Box>
			</Paper>
		</Container>
	);
}
