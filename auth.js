import { auth, db } from "./App.js";
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signInWithPopup, 
    GoogleAuthProvider,
    signInAnonymously,
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const authOverlay = document.getElementById("authOverlay");
const getStartedBtn = document.getElementById("getStartedBtn");
const switchAuthMode = document.getElementById("switchAuthMode");
const usernameGroup = document.getElementById("usernameGroup");
const authForm = document.getElementById("authForm");

// Show Auth UI
getStartedBtn.addEventListener("click", () => authOverlay.classList.remove("hidden"));

// Toggle Login / Register
let isSignUp = false;
switchAuthMode.addEventListener("click", (e) => {
    e.preventDefault();
    isSignUp = !isSignUp;
    usernameGroup.style.display = isSignUp ? "flex" : "none";
    document.getElementById("authTitle").innerText = isSignUp ? "Create Account" : "Sign In";
    document.getElementById("submitAuthBtn").innerText = isSignUp ? "Register" : "Sign In";
    switchAuthMode.innerText = isSignUp ? "Log In" : "Create Account";
});

// Handle Email Auth
authForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("authEmail").value;
    const password = document.getElementById("authPassword").value;
    
    try {
        if (isSignUp) {
            const cred = await createUserWithEmailAndPassword(auth, email, password);
            await setupUserDoc(cred.user);
        } else {
            await signInWithEmailAndPassword(auth, email, password);
        }
        window.location.href = "dashboard.html";
    } catch (err) { alert(err.message); }
});

// Guest Mode
document.getElementById("guestLoginBtn").addEventListener("click", async () => {
    try {
        const cred = await signInAnonymously(auth);
        await setupUserDoc(cred.user, true);
        window.location.href = "dashboard.html";
    } catch (err) { alert(err.message); }
});

async function setupUserDoc(user, isGuest = false) {
    await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: isGuest ? "Guest User" : user.email,
        status: "online",
        joined: serverTimestamp()
    });
}

// Global Auth Watcher
onAuthStateChanged(auth, (user) => {
    if (user && window.location.pathname.includes("index.html")) {
        window.location.href = "dashboard.html";
    }
});
