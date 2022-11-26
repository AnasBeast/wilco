// Import the functions you need from the SDKs you need
import { AppOptions, credential } from 'firebase-admin';

// Your web app's Firebase configuration
export const firebaseConfig: AppOptions = {
    credential: credential.cert({
        privateKey: process.env.PRIVATE_KEY,
        projectId: process.env.PROJECT_ID,
        clientEmail: process.env.CLIENT_EMAIL
    }),
    databaseURL: "https://wilco-test-2406a-default-rtdb.europe-west1.firebasedatabase.app"
};



