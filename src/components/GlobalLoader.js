'use client';

import { useSelector } from 'react-redux';
import Loader from './Loader';

export default function GlobalLoader() {
  const isLoading = useSelector((state) => state.loading.isLoading);
  
  return isLoading ? <Loader /> : null;
}
