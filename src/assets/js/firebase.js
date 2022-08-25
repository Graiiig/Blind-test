import {getDatabase, ref, set, push, onChildChanged, onValue, remove, query, orderByChild } from 'firebase/database'
import {initializeApp} from 'firebase/app'
import {getAuth, signInAnonymously, signOut, GoogleAuthProvider} from "firebase/auth";


// Récupération de la config Firebase depuis .env
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};
// Initisalisation de l'application Firebase
const appFb = initializeApp(firebaseConfig);

// Initialisation de l'authentification | doc : https://firebase.google.com/docs/auth/web/google-signin?authuser=0
const provider = new GoogleAuthProvider();
const auth = getAuth();

// Initilisation de la BDD
const db = getDatabase();

export {db, ref, set, push, onChildChanged, onValue, remove, query, orderByChild, auth, provider,
    signInAnonymously, signOut}