import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";

const firebaseConfig = {
    apiKey: "",
    authDomain: "colorchain-ec651.firebaseapp.com",
    projectId: "colorchain-ec651",
    storageBucket: "colorchain-ec651.firebasestorage.app",
    messagingSenderId: "788372812637",
    appId: "1:788372812637:web:ce98da8d9654c124372eb4",
    measurementId: "G-6WZLBGYYH3"
};

export const app = initializeApp(firebaseConfig);
console.log(app);