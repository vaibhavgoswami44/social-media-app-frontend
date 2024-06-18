import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const {
  VITE_apiKey: apiKey,
  VITE_authDomain: authDomain,
  VITE_projectId: projectId,
  VITE_storageBucket: storageBucket,
  VITE_messagingSenderId: messagingSenderId,
  VITE_appId: appId,
  VITE_measurementId: measurementId,
} = import.meta.env;
const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
  measurementId,
};

try {
  // Initialize Firebase
  var app = initializeApp(firebaseConfig);
  var messaging = getMessaging(app);
} catch (error) {
  console.log(error);
}

export { app, messaging };
