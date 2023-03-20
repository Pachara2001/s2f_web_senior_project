import { initializeApp } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js";
import { getAuth,signOut } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const logOut = document.querySelector("#logOut");
const firebaseConfig = {
    apiKey: "AIzaSyDzgtjeTWzsdRN4VUQs9pgClqYOrSu7JQY",
    authDomain: "sketch2face-6f527.firebaseapp.com",
    projectId: "sketch2face-6f527",
    storageBucket: "sketch2face-6f527.appspot.com",
    messagingSenderId: "213941302917",
    appId: "1:213941302917:web:9a88cd104f86ba76acdbec",
    measurementId: "G-B6EKLW8293"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
function initApp() {
    auth.onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        var email = user.email;
      } else {
        // User is signed out.
        window.location.replace("\\login");
      }
    }, function(error) {
      console.log(error);
    });
  };

  window.addEventListener('load', function() {
    initApp()
  });

function outbtn(){
    signOut(auth).then(() => {
        // Sign-out successful.
        }).catch((error) => {
        // An error happened.
        });
};
logOut.addEventListener("click", outbtn);
