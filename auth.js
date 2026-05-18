import { auth, db } from "./App.js";
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    signInWithPopup, 
    GoogleAuthProvider,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Global DOM Hooks elements mapping references check 
const authForm = document.getElementById("authForm");
const authContainer = document.getElementById("authContainer");
const heroSection = document.getElementById("heroSection");
const getStartedBtn = document.getElementById("getStartedBtn");
const navLoginBtn = document.getElementById("navLoginBtn");
const switchAuthMode = document.getElementById("switchAuthMode");
const usernameGroup = document.getElementById("usernameGroup");
const submitAuthBtn = document.getElementById("submitAuthBtn");
const googleAuthBtn = document.getElementById("googleAuthBtn");
const logoutBtn = document.getElementById("logoutBtn");

let isSignUpMode = false;

// Realtime Active Auth Session Route Watcher 
onAuthStateChanged(auth, (user) => {
    const isDashboard = window.location.pathname.includes("dashboard.html");
    if (user) {
        // User logged in state processing routing loops
        if (!isDashboard) {
            window.location.href = "dashboard.html";
        } else {
            initializeDashboardEngine(user);
        }
    } else {
        // Unauthenticated session guarding access loops
        if (isDashboard) {
            window.location.href = "index.html";
        }
    }
});

// Front Landing Page Interaction Management Logic bindings 
if (getStartedBtn) {
    getStartedBtn.addEventListener("click", () => {
        heroSection.classList.add("hidden");
        authContainer.classList.remove("hidden");
    });
}
if (navLoginBtn) {
    navLoginBtn.addEventListener("click", () => {
        heroSection.classList.add("hidden");
        authContainer.classList.remove("hidden");
    });
}

if (switchAuthMode) {
    switchAuthMode.addEventListener("click", (e) => {
        e.preventDefault();
        isSignUpMode = !isSignUpMode;
        usernameGroup.style.display = isSignUpMode ? "flex" : "none";
        submitAuthBtn.innerText = isSignUpMode ? "Create Account" : "Sign In";
        document.getElementById("authTitle").innerText = isSignUpMode ? "Join Mwamini" : "Welcome Back";
        switchAuthMode.innerText = isSignUpMode ? "Sign In" : "Sign Up";
    });
}

// Processing User Form Standard Core Submission Logic
if (authForm) {
    authForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("authEmail").value.trim();
        const password = document.getElementById("authPassword").value;
        const name = document.getElementById("authUsername").value.trim();

        try {
            if (isSignUpMode) {
                // Execute secure Registration
                const cred = await createUserWithEmailAndPassword(auth, email, password);
                await setDoc(doc(db, "users", cred.user.uid), {
                    uid: cred.user.uid,
                    displayName: name || "Anonymous User",
                    email: email,
                    photoURL: "https://via.placeholder.com/150",
                    status: "online",
                    lastSeen: serverTimestamp()
                });
            } else {
                // Execute login transaction
                await signInWithEmailAndPassword(auth, email, password);
            }
        } catch (error) {
            alert(`Authentication Error Profile Context: ${error.message}`);
        }
    });
}

// Google PopUp Single Sign On Gateway Action Handler Binding
if (googleAuthBtn) {
    googleAuthBtn.addEventListener("click", async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            await setDoc(doc(db, "users", result.user.uid), {
                uid: result.user.uid,
                displayName: result.user.displayName,
                email: result.user.email,
                photoURL: result.user.photoURL,
                status: "online",
                lastSeen: serverTimestamp()
            }, { merge: true });
        } catch (error) {
            alert(`Google Authentication Failure Error Node: ${error.message}`);
        }
    });
}

// Global Dashboard Context Functional Stream Initialization Engine 
function initializeDashboardEngine(user) {
    // Sync active profile info components context nodes visual elements
    const avatarImg = document.getElementById("currentUserAvatar");
    if (avatarImg) avatarImg.src = user.photoURL || "https://via.placeholder.com/40";
    
    // Bind global lifecycle operations disconnect commands UI streams
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            signOut(auth).then(() => { window.location.href = "index.html"; });
        });
    }

    // Set up Real-Time Chat System Architecture Event Listeners
    setupRealtimeChatEngine();
}

import { collection, query, orderBy, limit, onSnapshot, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

function setupRealtimeChatEngine() {
    const messagesLog = document.getElementById("messagesLog");
    const msgInput = document.getElementById("messageInputField");
    const sendBtn = document.getElementById("sendMessageBtn");
    const activeChatWindow = document.getElementById("activeChatWindow");
    const emptyView = document.getElementById("emptyView");

    // Stub mock state tracking: In production, switch this dynamically when selecting an active channel list object card item.
    let currentActiveRoomId = "global_lobby_stream_channel"; 

    if (!messagesLog) return; // Guard clause execution if script elements target environment matches index context.

    // Activate standard default container framework elements toggles
    if(emptyView) emptyView.classList.add("hidden");
    if(activeChatWindow) activeChatWindow.classList.remove("hidden");

    // Dynamic firestore document data reading pipeline instantiation
    const q = query(collection(db, "rooms", currentActiveRoomId, "messages"), orderBy("timestamp", "asc"), limit(50));
    
    onSnapshot(q, (snapshot) => {
        messagesLog.innerHTML = ""; // Wipe visual layer layout frame tracking structure clean before re-processing stream changes.
        snapshot.forEach((messageDoc) => {
            const data = messageDoc.data();
            const bubbleEl = document.createElement("div");
            const isMe = data.senderId === auth.currentUser?.uid;
            
            bubbleEl.className = `msg-bubble ${isMe ? 'msg-sent' : 'msg-received'}`;
            bubbleEl.innerHTML = `
                <p>${escapeHTML(data.text)}</p>
                <span class="msg-ts">${data.timestamp ? new Date(data.timestamp.toDate()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Just now'}</span>
            `;
            messagesLog.appendChild(bubbleEl);
        });
        messagesLog.scrollTop = messagesLog.scrollHeight; // Fast-scroll automatically to current focus bottom sequence view frame.
    });

    // Write transactional storage events output payload logic binding action triggers
    const triggerSendAction = async () => {
        const textPayload = msgInput.value.trim();
        if(!textPayload) return;

        msgInput.value = ""; // Clear input immediately for optimal perceived performance
        try {
            await addDoc(collection(db, "rooms", currentActiveRoomId, "messages"), {
                senderId: auth.currentUser.uid,
                senderName: auth.currentUser.displayName || "User",
                text: textPayload,
                timestamp: serverTimestamp()
            });
        } catch (err) {
            console.error("Transmission interruption code mismatch tracking error logs detail node:", err);
        }
    };

    if(sendBtn) sendBtn.addEventListener("click", triggerSendAction);
    if(msgInput) {
        msgInput.addEventListener("keydown", (event) => {
            if(event.key === "Enter") triggerSendAction();
        });
    }
}

// XSS mitigation handling sanitization routine utility logic conversion block helper 
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}
