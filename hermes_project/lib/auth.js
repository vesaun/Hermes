// lib/auth.js
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

export async function loginUser(email, password) {
  return await signInWithEmailAndPassword(auth, email, password);
}
