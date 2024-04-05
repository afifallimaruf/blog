// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBPFEXEGVKLD-u0UdAizcBR_cWwOUrtzEk",
    authDomain: "mern-blog-d4e19.firebaseapp.com",
    projectId: "mern-blog-d4e19",
    storageBucket: "mern-blog-d4e19.appspot.com",
    messagingSenderId: "704154114411",
    appId: "1:704154114411:web:a46d93d04a6f4d2b47d42e"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);