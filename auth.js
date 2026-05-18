import { auth, db } from './App.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, onSnapshot, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

onAuthStateChanged(auth, (user) => {
    if (user) {
        const userRef = doc(db, "users", user.uid);
        // Set online status
        updateDoc(userRef, { 
            status: "online", 
            lastSeen: serverTimestamp() 
        });

        // Handle disconnect (Automatic offline)
        window.addEventListener('beforeunload', () => {
            updateDoc(userRef, { status: "offline" });
        });
    }
});
