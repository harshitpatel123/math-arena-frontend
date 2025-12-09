'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../../store/store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GlobalLoader from '../../components/GlobalLoader';

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      {children}
      <GlobalLoader />
      <ToastContainer 
        position="top-right" 
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{
          fontSize: '14px',
        }}
        toastStyle={{
          borderRadius: '12px',
          padding: '12px 16px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        }}
      />
    </Provider>
  );
}
