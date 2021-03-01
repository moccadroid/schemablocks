import firebase from "firebase/app";
import "firebase/firestore";

const firebaseData = {
  dev: {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
  }
};

console.log(firebaseData['dev']);

const env = firebaseData['dev'];

if (!firebase.apps.length) {
  firebase.initializeApp(env);
}

export default firebase;
