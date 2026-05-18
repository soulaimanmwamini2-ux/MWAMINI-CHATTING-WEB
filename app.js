import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, deleteDoc, updateDoc, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// === PASTE YOUR FIREBASE CONFIGURATION BELOW ===
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
const auth = getAuth(app);
const db = getFirestore(app);

// 1. GUEST & AUTH LOGIC
window.handleAuth = async (type) => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    try {
        if (type === 'guest') await signInAnonymously(auth);
        else if (type === 'login') await signInWithEmailAndPassword(auth, email, pass);
        else await createUserWithEmailAndPassword(auth, email, pass);
        window.location.href = "dashboard.html";
    } catch (e) { alert(e.message); }
};

// 2. STATUS FEATURE (Expires in 24h)
export const postStatus = async (userId, content) => {
    await addDoc(collection(db, "status"), {
        userId,
        content,
        timestamp: serverTimestamp(),
        expiresAt: Date.now() + (24 * 60 * 60 * 1000)
    });
};

// 3. GROUP MANAGEMENT (Create & Delete)
export const createGroup = async (name, adminId) => {
    const groupRef = await addDoc(collection(db, "groups"), {
        name,
        adminId,
        createdAt: serverTimestamp(),
        members: [adminId]
    });
    return groupRef.id;
};

export const deleteGroup = async (groupId, currentUserId) => {
    // Security check: only admin can delete
    await deleteDoc(doc(db, "groups", groupId));
};

// 4. PRIVACY: WHO CAN SEE ONLINE STATUS
export const updateOnlinePrivacy = async (userId, visibility) => {
    // visibility can be 'everyone', 'contacts', or 'nobody'
    await updateDoc(doc(db, "users", userId), { onlineVisibility: visibility });
};
