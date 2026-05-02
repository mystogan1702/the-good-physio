// db.js - API Client for The Good Physio
const API_URL = 'https://the-good-physio-server.onrender.com';

async function loadDB() {
  try {
    const response = await fetch(`${API_URL}/api/database`);
    if (!response.ok) throw new Error('Network error');
    return await response.json();
  } catch (error) {
    console.warn('Server unavailable, using localStorage');
    const local = localStorage.getItem('physioDatabase');
    return local ? JSON.parse(local) : initializeLocalDB();
  }
}

async function saveDB(db) {
  localStorage.setItem('physioDatabase', JSON.stringify(db));
  try {
    await fetch(`${API_URL}/api/database`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(db)
    });
  } catch (error) {
    console.warn('Saved to localStorage (server unavailable)');
  }
}

function initializeLocalDB() {
  const defaultDB = {
    users: [
      { id: "DOC001", email: "dr.smith@goodphysio.com", password: "doctor123", name: "Dr. Sarah Smith", role: "doctor", specialization: "Sports Rehabilitation", license: "PT-2020-45678", created: "2025-01-15" },
      { id: "PAT001", email: "maria@email.com", password: "patient123", name: "Maria Garcia", role: "patient", firstname: "Maria", surname: "Garcia", age: "34", phone: "+63 912 345 6789", sex: "Female", occupation: "Teacher", created: "2025-03-10" }
    ],
    appointments: [],
    posts: [],
    ratings: [],
    availableSlots: ["09:00","10:00","11:00","13:00","14:00","15:00","16:00","17:00"]
  };
  localStorage.setItem('physioDatabase', JSON.stringify(defaultDB));
  return defaultDB;
}

function getLoggedInUser() {
  const u = localStorage.getItem('physioLoggedInUser');
  if (!u) {
    window.location.href = 'login.html';
    return null;
  }
  return JSON.parse(u);
}

async function loginUser(email, password, role) {
  try {
    const response = await fetch(`${API_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role })
    });
    return await response.json();
  } catch (error) {
    // Fallback to local
    const DB = loadDB();
    const user = DB.users.find(u => u.email === email && u.password === password && u.role === role);
    return user ? { success: true, user } : { success: false, message: 'Invalid credentials' };
  }
}

async function registerUser(userData) {
  try {
    const response = await fetch(`${API_URL}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: 'Cannot connect to server' };
  }
}
