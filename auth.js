import { auth, db } from "./App.js";
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signInAnonymously,
    sendEmailVerification,
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const authOverlay = document.getElementById("authOverlay");
const switchBtn = document.getElementById("switchAuthMode");
const usernameGroup = document.getElementById("usernameGroup");
const authForm = document.getElementById("authForm");

// UI Toggle Logic
document.getElementById("navLoginBtn").onclick = () => authOverlay.classList.remove("hidden");
document.getElementById("getStartedBtn").onclick = () => authOverlay.classList.remove("hidden");

let isRegistering = false;

switchBtn.onclick = (e) => {
    e.preventDefault();
    isRegistering = !isRegistering;
    usernameGroup.style.display = isRegistering ? "flex" : "none";
    document.getElementById("authTitle").innerText = isRegistering ? "Create Account" : "Secure Login";
    document.getElementById("submitAuthBtn").innerText = isRegistering ? "Register & Verify" : "Sign In";
    switchBtn.innerText = isRegistering ? "Login instead" : "Register Now";
};

// Form Logic
authForm.onsubmit = async (e) => {
    e.preventDefault();
    const email = document.getElementById("authEmail").value;
    const pass = document.getElementById("authPassword").value;
    const user = document.getElementById("authUsername").value;

    try {
        if (isRegistering) {
            const cred = await createUserWithEmailAndPassword(auth, email, pass);
            await sendEmailVerification(cred.user);
            await setDoc(doc(db, "users", cred.user.uid), { username: user, email });
            alert("Verification email sent! Please check your inbox before logging in.");
        } else {
            const cred = await signInWithEmailAndPassword(auth, email, pass);
            if (!cred.user.emailVerified) {
                alert("Please verify your email first!");
                return;
            }
            window.location.href = "dashboard.html";
        }
    } catch (err) { alert(err.message); }
};

// Guest Mode Logic
document.getElementById("guestModeBtn").onclick = async () => {
    try {
        await signInAnonymously(auth);
        window.location.href = "dashboard.html";
    } catch (err) { alert(err.message); }
};
