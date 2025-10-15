import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAhcSgmpBjyYkOdN8ypeSyvUbzImZ_sPIQ",
  authDomain: "vue-job-listing-app.firebaseapp.com",
  projectId: "vue-job-listing-app",
  storageBucket: "vue-job-listing-app.firebasestorage.app",
  messagingSenderId: "428197037379",
  appId: "1:428197037379:web:700724a37ca11ae7c55bf6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
