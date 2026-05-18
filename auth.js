import { auth, db } from './App.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export const handleLogin = async (email, password) => {
    try {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        // Automatically sets user to 'Online' if not in Invisible Mode
        return cred.user;
    } catch (e) { alert(e.message); }
};

export const registerUser = async (email, password, name) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "users", res.user.uid), {
        name,
        email,
        photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
        status: "Available",
        isInvisible: true, // Core Privacy Rule
        lastSeen: Date.now()
    });
};
