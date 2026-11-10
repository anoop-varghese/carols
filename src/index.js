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

// Remove the legacy service worker from visitors' browsers after the offline feature was retired.
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations
      .filter((registration) => [registration.active, registration.waiting, registration.installing]
        .some((worker) => worker && new URL(worker.scriptURL).pathname.endsWith('/sw.js')))
      .forEach((registration) => registration.unregister());
  });
}
