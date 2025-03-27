// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.2.9/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.9/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
  apiKey: "AIzaSyAMUPRiRPReoYc17c8V9Tz2OigkMA-Q7gk",
  authDomain: "irate-web.firebaseapp.com",
  projectId: "irate-web",
  storageBucket: "irate-web.appspot.com",
  messagingSenderId: "903775577594",
  appId: "1:903775577594:web:3a8e0d922d09389481b043",
  measurementId: "G-YENMEJM9WE"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
