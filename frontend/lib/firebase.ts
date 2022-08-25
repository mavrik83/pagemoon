// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: 'AIzaSyD7TK1HbvWuWFYlsuzeOCo_eKOQ6bKTqV4',
    authDomain: 'pagemoon-f7612.firebaseapp.com',
    projectId: 'pagemoon-f7612',
    storageBucket: 'pagemoon-f7612.appspot.com',
    messagingSenderId: '491943948246',
    appId: '1:491943948246:web:d456365b189a549be53e77',
    measurementId: 'G-T3YJ5CVSGF',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
