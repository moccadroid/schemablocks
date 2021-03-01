import firebase from "firebase/app";
import "firebase/firestore";

const firebaseData = {
  dev: {
    apiKey: "AIzaSyCESNhinHf4h0C8Oxvk-ZDllc6TentKBMo",
    authDomain: "vonkoeck-dev.firebaseapp.com",
    databaseURL: "https://vonkoeck-dev.firebaseio.com",
    projectId: "vonkoeck-dev",
    storageBucket: "vonkoeck-dev.appspot.com",
    messagingSenderId: "951497144946",
    appId: "1:951497144946:web:1612c4d928bf13a4"
  }
};

const env = firebaseData['dev'];

if (!firebase.apps.length) {
  firebase.initializeApp(env);
}

export default firebase;
