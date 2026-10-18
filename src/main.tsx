import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './shared/components/ErrorBoundary';

import './theme/globals.css';

// Guard against uncaught window errors from third-party scripts or sandboxes
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    // If it's a generic cross-origin Script error or Vite WebSocket error, suppress disruptive alerts
    if (
      event.message === 'Script error.' || 
      !event.filename ||
      (event.message && (event.message.includes('WebSocket') || event.message.includes('closed without opened'))) ||
      (event.filename && event.filename.includes('@vite/client'))
    ) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    console.warn('Captured script warning:', event);
  });

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    if (
      reason &&
      (
        (typeof reason.message === 'string' && (reason.message.includes('WebSocket') || reason.message.includes('closed without opened'))) ||
        (typeof reason.stack === 'string' && reason.stack.includes('@vite/client'))
      )
    ) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    console.warn('Unhandled promise rejection:', event.reason);
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

