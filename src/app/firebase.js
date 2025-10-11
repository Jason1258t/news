import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDO9MKyjjsIkb_uKoQ2f7aydzwMT4JFYhY",
    authDomain: "news-78e54.firebaseapp.com",
    projectId: "news-78e54",
    storageBucket: "news-78e54.firebasestorage.app",
    messagingSenderId: "151421926089",
    appId: "1:151421926089:web:2aeb304e310c49a75fab18",
    measurementId: "G-MN8CE6PVCC",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
