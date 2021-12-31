import { initializeApp } from 'firebase/app';
import { getStorage, ref } from 'firebase/storage';

export const BASE_URL = 'https://localhost:44398'

export const FIREBASE_CONFIG = {
    apiKey: "AIzaSyAZmy-t8ylRdPQqIkwk3EbR06__Oi1PN28",
    authDomain: "testdb-c320d.firebaseapp.com",
    databaseURL: "https://testdb-c320d-default-rtdb.firebaseio.com",
    projectId: "testdb-c320d",
    storageBucket: "testdb-c320d.appspot.com",
    messagingSenderId: "589451277140",
    appId: "1:589451277140:web:8156adfaec5e44c5ba0ec1",
    measurementId: "G-9J47BSRK3X"
};


const firebaseApp = initializeApp(FIREBASE_CONFIG);

export const storage = getStorage(firebaseApp);
export const storageRef = ref(storage, 'job-site-files');