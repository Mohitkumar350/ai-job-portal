const { initializeApp, getApps, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");

let firebaseAdminAuth;

try {
  const firebaseApp =
    getApps().length === 0
      ? initializeApp({
          credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY
              ? process.env.FIREBASE_PRIVATE_KEY
                  .replace(/^["']|["'],?$/g, "") // strip surrounding quotes/trailing comma
                  .replace(/\\n/g, "\n")
              : undefined,
          }),
        })
      : getApps()[0];

  firebaseAdminAuth = getAuth(firebaseApp);
} catch (error) {
  console.error("⚠️  Firebase Admin SDK failed to initialize:", error.message);
  console.error("   Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY in .env");
  // firebaseAdminAuth remains undefined — routes using it will return 500
}

module.exports = {
  firebaseAdminAuth,
};
