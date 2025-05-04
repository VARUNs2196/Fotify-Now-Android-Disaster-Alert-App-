
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInAnonymously,
  GoogleAuthProvider,
  signInWithCredential,
  createUserWithEmailAndPassword 
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDM1vhmBEpLiBi_TWgdpfGlr-dYOFQ8iEs",
  authDomain: "fortifynow.firebaseapp.com",
  projectId: "disaster-c3d22",
  storageBucket: "fortifynow.appspot.com",
  messagingSenderId: "176749528143",
  appId: "1:176749528143:android:bbacafe341bea64498963a"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export {
  auth,
  signInWithEmailAndPassword,
  signInAnonymously,
  createUserWithEmailAndPassword, 
  // GoogleAuthProvider,
  signInWithCredential
};
