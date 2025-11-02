// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// La tua configurazione Firebase
// Vai su Firebase Console → Project Settings → General → Your apps
const firebaseConfig = {
  apiKey: "AIzaSyBumJPvYWjnwvQ8s2zeS2WpS0QDk__URCM",
  authDomain: "flylens-bmd.firebaseapp.com",
  projectId: "flylens-bmd",
  storageBucket: "flylens-bmd.firebasestorage.app",
  messagingSenderId: "545578647642",
  appId: "1:545578647642:web:29eead9cd18e39344a9863",
  measurementId: "G-GVTRTSF28C"
};

// Inizializza Firebase
const app = initializeApp(firebaseConfig);

// Inizializza Firestore
export const db = getFirestore(app);
