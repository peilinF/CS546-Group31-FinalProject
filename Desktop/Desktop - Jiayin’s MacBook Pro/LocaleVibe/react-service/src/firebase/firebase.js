import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

let REACT_APP_FIREBASE_KEY = "AIzaSyBG3ta_n9CD_bCFlwDl8NY298yTawmuBZc"
let REACT_APP_FIREBASE_DOMAIN = "cs555-9091c.firebaseapp.com"
let REACT_APP_FIREBASE_PROJECT_ID =  "cs555-9091c"
let REACT_APP_FIREBASE_STORAGE_BUCKET = "cs555-9091c.appspot.com"
let REACT_APP_FIREBASE_MESSAGING_SENDER_ID = "94602880055"
let REACT_APP_FIREBASE_APP_ID = "1:94602880055:web:00ea142f4b67cb7518cbb2"

const app = initializeApp({
  apiKey: REACT_APP_FIREBASE_KEY,
  authDomain: REACT_APP_FIREBASE_DOMAIN,
  projectId: REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: REACT_APP_FIREBASE_APP_ID,
});


export const auth = getAuth(app);

export default app;