/* Generate a service worker using workbox-build after the CRA production build.
   This script is executed by the `postbuild` npm script and writes
   `build/service-worker.js` which the app registers at runtime.
*/

const { generateSW } = require('workbox-build');
const path = require('path');

const buildDir = path.join(__dirname, '..', 'build');

generateSW({
  swDest: path.join(buildDir, 'service-worker.js'),
  globDirectory: buildDir,
  globPatterns: [
    '**/*.{html,js,css,svg,png,ico,json,txt,webmanifest}'
  ],
  skipWaiting: true,
  clientsClaim: true,
  navigateFallback: '/index.html',
  runtimeCaching: [
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images-cache',
        expiration: { maxEntries: 60, maxAgeSeconds: 30 * 24 * 60 * 60 }
      }
    },
    {
      urlPattern: /\.(?:js|css)$/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-resources',
      }
    }
    ,
    // Google Fonts stylesheets
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*$/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'google-fonts-stylesheets',
      }
    },
    // Google Fonts webfont files
    {
      urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts-webfonts',
        expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
        cacheableResponse: { statuses: [0, 200] }
      }
    },
    // Generic font files (woff, woff2, ttf, eot, otf)
    {
      urlPattern: /\.(?:woff2?|eot|ttf|otf)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'local-fonts',
        expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
        cacheableResponse: { statuses: [0, 200] }
      }
    },
    // API requests - network first with a short timeout and cache fallback
    {
      urlPattern: /\/api\/.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        networkTimeoutSeconds: 3,
        expiration: { maxEntries: 50, maxAgeSeconds: 5 * 60 },
        cacheableResponse: { statuses: [0, 200] }
      }
    }
  ]
}).then(({ count, size, warnings }) => {
  if (warnings.length) {
    console.warn('Workbox warnings while generating SW:', warnings);
  }
  console.log(`Generated service-worker.js, which will precache ${count} files, ${size} bytes.`);
}).catch((err) => {
  console.error('Failed to generate service worker:', err);
  process.exit(1);
});
