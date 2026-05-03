// ═══════════════════════════════════════════════════════
//  auth.js — Firebase Authentication for ColorChain
//  Supports: Email/Password + Google Sign-In
// ═══════════════════════════════════════════════════════

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-database.js";
import { config } from './config.js';

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";


// ─────────────────────────────────────────────
//  YOUR FIREBASE CONFIG
//  Injected from GitHub Secrets via GitHub Actions
// ─────────────────────────────────────────────
const firebaseConfig = {
    apiKey: config.apiKey,
    authDomain: "colorchain-ec651.firebaseapp.com",
    databaseURL: "https://colorchain-ec651-default-rtdb.firebaseio.com/",
    projectId: "colorchain-ec651",
    storageBucket: "colorchain-ec651.firebasestorage.app",
    messagingSenderId: "788372812637",
    appId: "1:788372812637:web:ce98da8d9654c124372eb4",
    measurementId: "G-6WZLBGYYH3"
};



const app      = initializeApp(firebaseConfig);
export const database = getDatabase(app);
const auth     = getAuth(app);
const provider = new GoogleAuthProvider();

// ── DOM elements ──
const authPage = document.getElementById("auth-page");
const gamePage = document.getElementById("game-page");
const errorBox = document.getElementById("auth-error");

const signupEmailEl    = document.getElementById("signup-email");
const signupUsernameEl = document.getElementById("signup-username");
const signupPasswordEl = document.getElementById("signup-password");
const signupBtn        = document.getElementById("signup-btn");

const loginEmailEl    = document.getElementById("login-email");
const loginPasswordEl = document.getElementById("login-password");
const loginBtn        = document.getElementById("login-btn");

const logoutBtn  = document.getElementById("logout-btn");
const userAvatar = document.getElementById("user-avatar");
const userNameEl = document.getElementById("user-name");
const userEmail  = document.getElementById("user-email");
const userUid    = document.getElementById("user-uid");
const gUserBlock = document.getElementById("g-user-block");

// ── Auth state gatekeeper ──
onAuthStateChanged(auth, (user) => {
  if (!user) {
    gamePage.style.display = "none";
    gUserBlock.style.display = "none";
    authPage.style.display = "block";
    return;
  }

  authPage.style.display = "none";
  gamePage.style.display = "flex";
  gUserBlock.style.display = "flex";

  const name  = user.displayName || user.email || "?"; // ✅ fallback chain
  userAvatar.textContent = name.charAt(0).toUpperCase();
  userNameEl.textContent = user.displayName;
});

// ── Sign up ──
signupBtn.addEventListener("click", async () => {
  const email    = signupEmailEl.value.trim();
  const username = signupUsernameEl.value.trim();
  const password = signupPasswordEl.value;
  if (!email || !password) { showError("Please fill in all fields."); return; }
  if (!username) { showError("Please choose a username."); return; }
  signupBtn.textContent = "Creating account…"; signupBtn.disabled = true;
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: username });
    clearError();
  }
  catch (err) { showError(friendlyError(err.code)); }
  finally { signupBtn.textContent = "Create Account"; signupBtn.disabled = false; }
});

// ── Log in ──
loginBtn.addEventListener("click", async () => {
  const email = loginEmailEl.value.trim(), password = loginPasswordEl.value;
  if (!email || !password) { showError("Please enter your email and password."); return; }
  loginBtn.textContent = "Logging in…"; loginBtn.disabled = true;
  try { await signInWithEmailAndPassword(auth, email, password); clearError(); }
  catch (err) { showError(friendlyError(err.code)); }
  finally { loginBtn.textContent = "Log In"; loginBtn.disabled = false; }
});



// ── Log out ──
logoutBtn.addEventListener("click", () => signOut(auth));

// ── Enter key ──
signupUsernameEl.addEventListener("keydown", (e) => { if (e.key === "Enter") signupPasswordEl.focus(); });
signupPasswordEl.addEventListener("keydown", (e) => { if (e.key === "Enter") signupBtn.click(); });
loginPasswordEl.addEventListener("keydown",  (e) => { if (e.key === "Enter") loginBtn.click(); });

// ── Helpers ──
function showError(msg) { errorBox.textContent = msg; errorBox.style.display = "block"; }
function clearError()   { errorBox.textContent = "";  errorBox.style.display = "none"; }
function friendlyError(code) {
  return ({
    "auth/email-already-in-use":   "That email is already registered. Try logging in.",
    "auth/invalid-email":          "Please enter a valid email address.",
    "auth/weak-password":          "Password must be at least 6 characters.",
    "auth/user-not-found":         "No account found with that email.",
    "auth/wrong-password":         "Incorrect password. Please try again.",
    "auth/invalid-credential":     "Incorrect email or password.",
    "auth/too-many-requests":      "Too many attempts. Please wait a moment.",
    "auth/network-request-failed": "Network error. Check your connection.",
    "auth/popup-blocked":          "Popup was blocked. Allow popups and retry.",
  })[code] || "Something went wrong. Please try again.";
}

export { auth };