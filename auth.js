import { auth, db } from './App.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export const renderAuth = (container) => {
    container.innerHTML = `
        <div class="bg-white p-8 rounded-lg shadow-xl w-96 text-center">
            <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" class="w-16 mx-auto mb-4">
            <h2 class="text-2xl font-bold mb-6 text-[#00a884]">Mwamini Pro</h2>
            <input id="email" type="email" placeholder="Email" class="w-full p-3 mb-3 border rounded">
            <input id="pass" type="password" placeholder="Password" class="w-full p-3 mb-6 border rounded">
            <button onclick="login()" class="w-full bg-[#00a884] text-white p-3 rounded mb-2 font-bold">Login</button>
            <button onclick="register()" class="w-full border border-[#00a884] text-[#00a884] p-3 rounded mb-4">Register</button>
            <div class="border-t pt-4">
                <button onclick="guestMode()" class="text-gray-500 text-sm">Continue as Guest</button>
            </div>
        </div>
    `;
};

window.login = () => {
    const e = document.getElementById('email').value;
    const p = document.getElementById('pass').value;
    signInWithEmailAndPassword(auth, e, p).catch(err => alert(err.message));
};

window.register = async () => {
    const e = document.getElementById('email').value;
    const p = document.getElementById('pass').value;
    const res = await createUserWithEmailAndPassword(auth, e, p);
    await setDoc(doc(db, "users", res.user.uid), {
        email: e,
        onlineVisibility: 'everyone',
        bgPreference: '#efeae2'
    });
};

window.guestMode = () => {
    sessionStorage.setItem('guestMode', 'true');
    signInAnonymously(auth);
};
