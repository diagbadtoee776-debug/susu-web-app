// client/src/serviceWorkerRegistration.js
const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
  window.location.hostname === '[::1]' ||
  window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

export function register(config) {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      // ✅ POINTS TO PUBLIC FOLDER - BYPASSES REACT BUILD PROCESSING
      const swUrl = `${process.env.PUBLIC_URL}/custom-sw.js`;
      
      if (isLocalhost) {
        checkValidServiceWorker(swUrl, config);
      } else {
        registerValidSW(swUrl, config);
      }
    });
  }
}

function registerValidSW(swUrl, config) {
  navigator.serviceWorker.register(swUrl).then((registration) => {
    registration.onupdatefound = () => {
      const installingWorker = registration.installing;
      if (installingWorker == null) return;
      installingWorker.onstatechange = () => {
        if (installingWorker.state === 'installed') {
          if (navigator.serviceWorker.controller) {
            console.log('New content available; please refresh.');
            if (config && config.onUpdate) config.onUpdate(registration);
          } else {
            console.log('Content cached for offline use.');
            if (config && config.onSuccess) config.onSuccess(registration);
          }
        }
      };
    };
  }).catch((error) => console.error('Error during SW registration:', error));
}

function checkValidServiceWorker(swUrl, config) {
  fetch(swUrl, { headers: { 'Service-Worker': 'script' } })
    .then((response) => {
      const contentType = response.headers.get('content-type');
      if (response.status === 404 || (contentType != null && contentType.indexOf('javascript') === -1)) {
        navigator.serviceWorker.ready.then((registration) => registration.unregister());
      } else {
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => console.log('No internet connection found. App running in offline mode.'));
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => registration.unregister())
      .catch((error) => console.error(error.message));
  }
}