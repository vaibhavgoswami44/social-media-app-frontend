// eslint-disable-next-line no-undef
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
// eslint-disable-next-line no-undef
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js",
);

const firebaseConfig = {
  apiKey: "AIzaSyD43t3uP3fZSFDEmxwBwWWG10VQWIS9UMs",
  authDomain: "real-talk-70785.firebaseapp.com",
  projectId: "real-talk-70785",
  storageBucket: "real-talk-70785.appspot.com",
  messagingSenderId: "709868305417",
  appId: "1:709868305417:web:bf5853110a3fae5fa30cd8",
  measurementId: "G-M7Y0Z9PWJC",
};

// eslint-disable-next-line no-undef
firebase.initializeApp(firebaseConfig);
// eslint-disable-next-line no-undef
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload,
  );

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    data: payload.data, // Including all data
  };

  // Check if an image URL is provided in the data
  if (payload.data && payload.data.image) {
    notificationOptions.icon  = payload.data.icon; // Set the image URL in notification options
  }

  // self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(self.clients.openWindow(event.notification.data.link)); // Accessing the link correctly
});
