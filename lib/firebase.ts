import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCUkNtHv43Itib6j1EoZtEDRNTmeqEWVxY",
  authDomain: "comercial-ribeiro-facul.firebaseapp.com",
  projectId: "comercial-ribeiro-facul",
  storageBucket: "comercial-ribeiro-facul.firebasestorage.app",
  messagingSenderId: "555467571743",
  appId: "1:555467571743:web:ddc9dcae4dc50446bd4b2a",
  measurementId: "G-74ES2NB9D6"
};

// Inicializa o app apenas se ainda não tiver sido inicializado
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Exporta os serviços que você vai usar
export const auth = getAuth(app);      // Para autenticação de usuários
export const db = getFirestore(app);   // Para salvar dados no Firestore
export const analytics = getAnalytics(app); // Opcional
