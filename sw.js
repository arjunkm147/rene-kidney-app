// sw.js
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (evt) => {
  evt.waitUntil(self.clients.claim());
});

// When a notification is clicked, focus an existing tab or open one.
self.addEventListener('notificationclick', (event) => {
  const url = (event.notification && event.notification.data && event.notification.data.url) || '/';
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientsArr => {
      for (const client of clientsArr) {
        if ('focus' in client) {
          client.focus();
          client.postMessage && client.postMessage({ type: 'NOTIF_CLICKED', url });
          return;
        }
      }
      return self.clients.openWindow(url);
    })
  );
});
