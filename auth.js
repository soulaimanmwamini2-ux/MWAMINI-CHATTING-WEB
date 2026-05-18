import { signInAnonymously } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// New Guest Login Handler
const guestLoginBtn = document.getElementById("guestLoginBtn");

if (guestLoginBtn) {
    guestLoginBtn.addEventListener("click", async () => {
        try {
            const result = await signInAnonymously(auth);
            console.log("Logged in as Guest:", result.user.uid);
            // Setup temporary profile in Firestore
            await setDoc(doc(db, "users", result.user.uid), {
                uid: result.user.uid,
                displayName: "Guest_" + Math.floor(Math.random() * 1000),
                isAnonymous: true,
                status: "online",
                lastSeen: serverTimestamp()
            });
        } catch (error) {
            alert("Guest access failed: " + error.message);
        }
    });
}

// Security Feature: Password Reset Logic
const forgotPasswordBtn = document.getElementById("forgotPasswordBtn");
if (forgotPasswordBtn) {
    forgotPasswordBtn.addEventListener("click", async () => {
        const email = document.getElementById("authEmail").value;
        if (!email) return alert("Please enter your email first.");
        try {
            await sendPasswordResetEmail(auth, email);
            alert("Security reset link sent to your email!");
        } catch (error) {
            alert(error.message);
        }
    });
}
