import {getDatabase, ref, set, push, onChildChanged, onValue, remove } from 'firebase/database'
import {initializeApp} from 'firebase/app'

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
const appFb = initializeApp(firebaseConfig);

const db = getDatabase();

export {db, ref, set, push, onChildChanged, onValue, remove}