import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; 

const firebaseConfig = {
  apiKey: "AIzaSyAzRuN1rYYgjwml3bkzhLw8ujlM8I8x9Xs",
  authDomain: "nicolwork-1.firebaseapp.com",
  projectId: "nicolwork-1",
  messagingSenderId: "213172189454",
  appId: "1:213172189454:web:006053d67129f1890f3f5f"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
