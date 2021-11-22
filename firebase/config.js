// import { initializeApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';
// import { getStorage } from 'firebase/storage';
// import { getFirestore } from 'firebase/firestore/lite';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/storage';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDS8FBU5snb8eix4mGZGsLBXtHtjIz3Vg4',
  authDomain: 'my-fancy-photoplace.firebaseapp.com',
  databaseURL:
    'https://my-fancy-photoplace-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'my-fancy-photoplace',
  storageBucket: 'my-fancy-photoplace.appspot.com',
  messagingSenderId: '372163979222',
  appId: '1:372163979222:web:404e2042cd0160e67aa677',
  measurementId: 'G-3PNLE1L8T2',
};

// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// export const firestore = getFirestore(app);
// export const storage = getStorage(app);
export default firebase.initializeApp(firebaseConfig);
