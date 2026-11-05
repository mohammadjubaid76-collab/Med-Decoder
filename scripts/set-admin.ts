import 'dotenv/config';
import fs from 'node:fs';
import { initializeApp, getApps } from 'firebase-admin/app';
import { cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

const email = process.argv[2]?.trim();
if (!email) {
  console.error('Usage: npm run set-admin -- admin@example.com');
  process.exit(1);
}

const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
const googleCredentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim();
if (!getApps().length) {
  if (serviceAccountJson) {
    const parsed = JSON.parse(serviceAccountJson);
    initializeApp({
      credential: cert(parsed),
      projectId: process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID || parsed.project_id || 'med-decoder',
    });
  } else if (googleCredentialsPath) {
    if (!fs.existsSync(googleCredentialsPath)) {
      console.error('GOOGLE_APPLICATION_CREDENTIALS points to a file that does not exist.');
      process.exit(1);
    }
    const parsed = JSON.parse(fs.readFileSync(googleCredentialsPath, 'utf8'));
    const projectId = process.env.FIREBASE_PROJECT_ID || parsed.project_id || 'med-decoder';
    if (parsed.project_id && parsed.project_id !== projectId) {
      console.error('Firebase service account project ID does not match FIREBASE_PROJECT_ID.');
      process.exit(1);
    }
    initializeApp({ credential: cert(parsed), projectId });
  } else {
    console.error('Firebase Admin credentials are required. Set GOOGLE_APPLICATION_CREDENTIALS to an external service-account JSON file.');
    process.exit(1);
  }
}

const user = await getAuth().getUserByEmail(email);
await getAuth().setCustomUserClaims(user.uid, {
  ...user.customClaims,
  role: 'admin',
});
await getFirestore().collection('users').doc(user.uid).set({
  uid: user.uid,
  email: user.email || email,
  name: user.displayName || '',
  role: 'admin',
  disabled: false,
  updatedAt: FieldValue.serverTimestamp(),
}, { merge: true });

console.log(`Admin role assigned to ${email}. The user must sign in again or refresh their token.`);
