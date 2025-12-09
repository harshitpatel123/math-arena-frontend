'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Loader from './Loader';

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, [router]);

  if (loading) return <Loader />;

  return isAuthenticated ? children : null;
}
