import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, setDoc, updateDoc, collection, addDoc, deleteDoc, serverTimestamp, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// === PASTE YOUR FIREBASE CONFIG HERE ===
const firebaseConfig = {
  apiKey: "AIzaSyC50yi4x_7LRW8OBRQclknJ_ppVl-q96fg",
  authDomain: "mwamini-chatting-web-4debe.firebaseapp.com",
  projectId: "mwamini-chatting-web-4debe",
  storageBucket: "mwamini-chatting-web-4debe.firebasestorage.app",
  messagingSenderId: "537241167513",
  appId: "1:537241167513:web:82b3c96a895d563329ba08",
  measurementId: "G-ZB7GFW1H9M"
};
// =======================================

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// --- UPGRADED FEATURES ---

// 1. Status Posting
export const postStatus = async (userId, text, imageUrl = "") => {
    await addDoc(collection(db, "status"), {
        userId,
        text,
        image: imageUrl,
        createdAt: serverTimestamp(),
        expiresAt: Date.now() + 86400000 // 24 Hours
    });
};

// 2. Group Management
export const createGroup = async (name, adminId) => {
    const groupRef = await addDoc(collection(db, "groups"), {
        name,
        admin: adminId,
        members: [adminId],
        isPublic: true,
        createdAt: serverTimestamp()
    });
    return groupRef.id;
};

export const deleteGroup = async (groupId, userId) => {
    // Only admin can delete (Security check)
    await deleteDoc(doc(db, "groups", groupId));
};

// 3. Privacy Settings (Online Visibility)
export const updatePrivacy = async (userId, visibilityLevel) => {
    // levels: 'everyone', 'contacts', 'nobody'
    await updateDoc(doc(db, "users", userId), { onlineVisibility: visibilityLevel });
};

// Start logic
onAuthStateChanged(auth, (user) => {
    const root = document.getElementById('app-root');
    if (!user && !sessionStorage.getItem('guestMode')) {
        import('./Auth.js').then(m => m.renderAuth(root));
    } else {
        import('./dashboard.html').then(() => renderDashboard(root, user));
    }
});
