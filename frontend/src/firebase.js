import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// =====================================================
// FIREBASE WEB APP CONFIG
// =====================================================

const firebaseConfig = {
  apiKey: "AIzaSyBVRkcfnRhsBGaxzIRUDWCMuyAgchrqn_k",
  authDomain: "job-portal-a06e7.firebaseapp.com",
  projectId: "job-portal-a06e7",
  storageBucket: "job-portal-a06e7.firebasestorage.app",
  messagingSenderId: "1020835578947",
  appId: "1:1020835578947:web:a3b200d3e2f36c9ae1c0f6",
};

// =====================================================
// INITIALIZE FIREBASE
// =====================================================

const app = initializeApp(firebaseConfig);

// =====================================================
// FIREBASE AUTH
// =====================================================

export const auth = getAuth(app);

// =====================================================
// DEVELOPMENT TEST MODE
// =====================================================
// IMPORTANT:
// Only use with fictional phone numbers configured
// in Firebase Console.
// Do NOT use this in production.

auth.settings.appVerificationDisabledForTesting = true;

// =====================================================
// DEBUG
// =====================================================

console.log("🔥 FIREBASE PROJECT:", auth.app.options.projectId);

console.log("🔥 FIREBASE APP ID:", auth.app.options.appId);

// =====================================================
// EXPORT
// =====================================================

export default app;
