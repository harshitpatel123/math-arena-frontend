'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const publicRoutes = ['/', '/login', '/register'];

export default function AuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const isPublicRoute = publicRoutes.includes(pathname);

    if (!token && !isPublicRoute) {
      router.push('/login');
      setIsAuthorized(false);
    } else {
      setIsAuthorized(true);
    }
    
    setIsChecking(false);
  }, [pathname, router]);

  if (isChecking) return null;
  if (!isAuthorized) return null;

  return children;
}
