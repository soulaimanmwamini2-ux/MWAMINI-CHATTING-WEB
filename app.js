import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, query, onSnapshot, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// === PASTE YOUR FIREBASE CONFIGURATION HERE ===
const firebaseConfig = {
  apiKey: "AIzaSyC50yi4x_7LRW8OBRQclknJ_ppVl-q96fg",
  authDomain: "mwamini-chatting-web-4debe.firebaseapp.com",
  projectId: "mwamini-chatting-web-4debe",
  storageBucket: "mwamini-chatting-web-4debe.firebasestorage.app",
  messagingSenderId: "537241167513",
  appId: "1:537241167513:web:82b3c96a895d563329ba08",
  measurementId: "G-ZB7GFW1H9M"
};
// ==============================================

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Message Sender Logic
export const sendMessage = async (chatId, text, senderId) => {
    if (!text.trim()) return;
    await addDoc(collection(db, "chats", chatId, "messages"), {
        text,
        senderId,
        timestamp: serverTimestamp(),
        status: 'sent' // sent, delivered, read
    });
};

// Listen for Auth Changes
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "index.html"; 
    } else {
        // Initialize Dashboard logic
    }
});
