import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyChidtgww4rzIV8tUOrJEmOPdfWFv_sTbA",
  authDomain: "adaptive-e-learning-323f3.firebaseapp.com",
  projectId: "adaptive-e-learning-323f3",
  storageBucket: "adaptive-e-learning-323f3.firebasestorage.app",
  messagingSenderId: "608499611832",
  appId: "1:608499611832:web:09989583b0f6e95aa65c4d"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export const FASTAPI_URL = 'http://localhost:8000';