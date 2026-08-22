const admin = require("firebase-admin");
const { getAuth } = require("firebase-admin/auth");
const path = require("path");

const serviceAccountPath = path.join(
  __dirname,
  "..",
  "firebase-service-account.json",
);

if (!admin.getApps().length) {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)
    : require(serviceAccountPath);

  admin.initializeApp({
    credential: admin.cert(serviceAccount),
  });

  console.log("🔥 Firebase Admin SDK initialized successfully");
}

const firebaseAdminAuth = getAuth();

module.exports = {
  admin,
  firebaseAdminAuth,
};
