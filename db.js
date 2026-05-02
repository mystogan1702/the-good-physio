// db.js - API client for The Good Physio
// CHANGE THIS URL to your Render.com URL after deployment
const API_URL = 'https://the-good-physio-server.onrender.com';
// For local testing: const API_URL = 'http://localhost:3000';

async function loadDB() {
  try {
    const response = await fetch(`${API_URL}/api/database`);
    if (!response.ok) throw new Error('Network error');
    return await response.json();
  } catch (error) {
    console.error('Server unavailable, using localStorage fallback');
    const local = localStorage.getItem('physioDatabase');
    return local ? JSON.parse(local) : initializeLocalDB();
  }
}

async function saveDB(db) {
  // Save locally first (backup)
  localStorage.setItem('physioDatabase', JSON.stringify(db));
  
  try {
    await fetch(`${API_URL}/api/database`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(db)
    });
  } catch (error) {
    console.warn('Could not sync to server, data saved locally');
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
  const u = localStorage.getItem('physioLoggedInUser') || sessionStorage.getItem('physioLoggedInUser');
  return u ? JSON.parse(u) : null;
}

// Helper: Login via API
async function loginViaAPI(email, password, role) {
  try {
    const response = await fetch(`${API_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role })
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: 'Cannot connect to server' };
  }
}

// Helper: Register via API
async function registerViaAPI(userData) {
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