import React from 'react';
import { AppProviders, AppRouter } from '@/app';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <AppProviders>
        <AppRouter />
      </AppProviders>
    </ErrorBoundary>
  );
}

