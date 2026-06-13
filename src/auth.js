import { auth } from './firebase.js';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from "firebase/auth";

const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = '/todo.html';
    } catch (error) {
      alert('로그인 실패: ' + error.message);
    }
  });
}

if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert('회원가입 성공! 로그인해주세요.');
    } catch (error) {
      alert('회원가입 실패: ' + error.message);
    }
  });
}
