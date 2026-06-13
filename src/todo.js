import { auth, db } from './firebase.js';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { 
  collection, addDoc, onSnapshot, 
  deleteDoc, doc, query, where, updateDoc 
} from "firebase/firestore";

const logoutBtn = document.getElementById('logout-btn');
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

let currentUser = null;

onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    loadTodos(user.uid);
  } else {
    window.location.href = '/index.html';
  }
});

logoutBtn?.addEventListener('click', async () => {
  await signOut(auth);
});

todoForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!todoInput.value.trim() || !currentUser) return;

  try {
    await addDoc(collection(db, "todos"), {
      text: todoInput.value,
      userId: currentUser.uid,
      completed: false,
      createdAt: new Date()
    });
    todoInput.value = '';
  } catch (error) {
    console.error("Error adding document: ", error);
  }
});

function loadTodos(userId) {
  const q = query(collection(db, "todos"), where("userId", "==", userId));
  
  onSnapshot(q, (snapshot) => {
    todoList.innerHTML = '';
    snapshot.forEach((docSnap) => {
      const todo = docSnap.data();
      const li = document.createElement('li');
      
      const textSpan = document.createElement('span');
      textSpan.textContent = todo.text;
      if (todo.completed) textSpan.style.textDecoration = 'line-through';
      
      const toggleBtn = document.createElement('button');
      toggleBtn.textContent = todo.completed ? '취소' : '완료';
      toggleBtn.onclick = () => toggleTodo(docSnap.id, todo.completed);
      
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = '삭제';
      deleteBtn.style.backgroundColor = '#f44336';
      deleteBtn.onclick = () => deleteTodo(docSnap.id);
      
      li.appendChild(textSpan);
      li.appendChild(toggleBtn);
      li.appendChild(deleteBtn);
      todoList.appendChild(li);
    });
  });
}

async function toggleTodo(id, currentStatus) {
  const todoRef = doc(db, "todos", id);
  await updateDoc(todoRef, {
    completed: !currentStatus
  });
}

async function deleteTodo(id) {
  await deleteDoc(doc(db, "todos", id));
}
