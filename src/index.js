import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register service worker only in production to avoid interfering with the dev server (HMR)
if ('serviceWorker' in navigator) {
  if (process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      // register the basic service worker in production build
      navigator.serviceWorker.register('/sw.js').then((reg) => {
        // eslint-disable-next-line no-console
        console.log('Service worker registered.', reg);
      }).catch((err) => {
        // eslint-disable-next-line no-console
        console.warn('Service worker registration failed:', err);
      });
    });
  } else {
    // In development, unregister any previously-registered service workers to avoid
    // caching artifacts (like interfering with webpack hot-update.json requests).
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((r) => r.unregister());
    });
  }
}
