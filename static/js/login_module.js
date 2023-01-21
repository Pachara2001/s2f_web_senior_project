import { initializeApp } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
    apiKey: "AIzaSyDzgtjeTWzsdRN4VUQs9pgClqYOrSu7JQY",
    authDomain: "sketch2face-6f527.firebaseapp.com",
    projectId: "sketch2face-6f527",
    storageBucket: "sketch2face-6f527.appspot.com",
    messagingSenderId: "213941302917",
    appId: "1:213941302917:web:9a88cd104f86ba76acdbec",
    measurementId: "G-B6EKLW8293"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
var uiConfig = {
    signInSuccessUrl: "\\",
    signInOptions: [
      {
        provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
        disableSignUp: {status: true}
      }
      
    ]
  };

  var ui = new firebaseui.auth.AuthUI(auth);
  ui.start('#firebaseui-auth-container', uiConfig);