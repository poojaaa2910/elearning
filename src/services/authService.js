import { 
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, getDocs, collection, query, where, limit } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

const googleProvider = new GoogleAuthProvider();

const ADMIN_SECRET_CODE = import.meta.env.VITE_ADMIN_SECRET_CODE || 'admin@123';

export const authService = {
  async signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          role: 'user',
          preferredLearning: 'text',
          visionDifficulty: 'none',
          readingSpeed: 'medium',
          colorBlindMode: false,
          cognitiveMode: false,
          onboardingCompleted: false,
          createdAt: new Date().toISOString()
        });
      } else {
        const data = userDoc.data();
        if (!data.preferredLearning || !data.visionDifficulty || 
            !data.readingSpeed || data.colorBlindMode === undefined || 
            data.cognitiveMode === undefined) {
          await updateDoc(doc(db, 'users', user.uid), {
            preferredLearning: data.preferredLearning || 'text',
            visionDifficulty: data.visionDifficulty || 'none',
            readingSpeed: data.readingSpeed || 'medium',
            colorBlindMode: data.colorBlindMode !== undefined ? data.colorBlindMode : false,
            cognitiveMode: data.cognitiveMode !== undefined ? data.cognitiveMode : false,
            onboardingCompleted: false
          });
        }
      }
      
      return user;
    } catch (error) {
      console.error('Error in signInWithGoogle:', error);
      throw error;
    }
  },

  async signInWithEmail(email, password) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;
      
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || email.split('@')[0],
          role: 'user',
          preferredLearning: 'text',
          visionDifficulty: 'none',
          readingSpeed: 'medium',
          colorBlindMode: false,
          cognitiveMode: false,
          onboardingCompleted: false,
          createdAt: new Date().toISOString()
        });
      }
      
      return user;
    } catch (error) {
      console.error('Error in signInWithEmail:', error);
      throw error;
    }
  },

  async registerWithEmail(email, password, displayName) {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;
      
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: displayName || email.split('@')[0],
        role: 'user',
        preferredLearning: 'text',
        visionDifficulty: 'none',
        readingSpeed: 'medium',
        colorBlindMode: false,
        cognitiveMode: false,
        onboardingCompleted: false,
        createdAt: new Date().toISOString()
      });
      
      return user;
    } catch (error) {
      console.error('Error in registerWithEmail:', error);
      throw error;
    }
  },

  async becomeAdmin(secretCode, uid) {
    if (secretCode !== ADMIN_SECRET_CODE) {
      throw new Error('Invalid secret code');
    }
    
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      role: 'admin',
      secretCodeUsed: true
    });
    
    return true;
  },

  async checkIsAdmin(uid) {
    if (!uid) return false;
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (!userDoc.exists()) return false;
    return userDoc.data().role === 'admin';
  },

  async logout() {
    await signOut(auth);
  },

  onAuthChange(callback) {
    return onAuthStateChanged(auth, callback);
  },

  getCurrentUser() {
    return auth.currentUser;
  },

  async updateUserProfile(uid, data) {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      ...data,
      onboardingCompleted: true
    });
  },

  async getUserRole(uid) {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (!userDoc.exists()) return 'user';
    return userDoc.data().role || 'user';
  }
};