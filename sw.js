// ふたりのカレンダー - Service Worker
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAxddJ4FpatbZ5Fj_on5QK5VEkaXBljXW4",
  authDomain: "futari-calendar-4bc43.firebaseapp.com",
  databaseURL: "https://futari-calendar-4bc43-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "futari-calendar-4bc43",
  storageBucket: "futari-calendar-4bc43.firebasestorage.app",
  messagingSenderId: "1064389123516",
  appId: "1:1064389123516:web:e3ce97219cf31aee8f1fb9"
});

const messaging = firebase.messaging();

// バックグラウンド通知（アプリが閉じている・バックグラウンド時）
messaging.onBackgroundMessage(payload => {
  const { title, body, icon } = payload.notification || {};
  self.registration.showNotification(title || 'ふたりのカレンダー', {
    body: body || '',
    icon: icon || '/couple-calendar/icon-192.png',
    badge: '/couple-calendar/icon-192.png',
    tag: payload.collapseKey || 'calendar-notif',
    data: payload.data || {},
    requireInteraction: false,
  });
});

// 通知クリック時にアプリを開く
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url.includes('couple-calendar') && 'focus' in client) {
          return client.focus();
        }
      }
      return clients.openWindow('/couple-calendar/couple-calendar.html');
    })
  );
});

// Service Worker インストール・アクティベート
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));
