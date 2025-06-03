// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyA7NKKJ_4vSS2LwiabXfkU65gBYmVTw6Y8",
  authDomain: "pokemontcg-app-623d7.firebaseapp.com",
  projectId: "pokemontcg-app-623d7",
  storageBucket: "pokemontcg-app-623d7.appspot.com",
  messagingSenderId: "24433456379",
  appId: "1:24433456379:android:5b86d0ca44d23b1c08ec5e"
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

const db = getFirestore(app);

export { auth, db };