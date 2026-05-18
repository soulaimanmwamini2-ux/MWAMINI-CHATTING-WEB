import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC50yi4x_7LRW8OBRQclknJ_ppVl-q96fg",
  authDomain: "mwamini-chatting-web-4debe.firebaseapp.com",
  projectId: "mwamini-chatting-web-4debe",
  storageBucket: "mwamini-chatting-web-4debe.firebasestorage.app",
  messagingSenderId: "537241167513",
  appId: "1:537241167513:web:82b3c96a895d563329ba08",
  measurementId: "G-ZB7GFW1H9M"
};

// Initialize Firebase Production Engine
const app = initializeApp(firebaseConfig);

// Export instances to handle real-time subscriptions downstream
export const auth = getAuth(app);
export const db = getFirestore(app);
