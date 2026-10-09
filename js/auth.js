// js/auth.js
// Complete authentication logic: signup, login, logout, session management

const USERS_KEY = 'yge_users';
const PATIENTS_KEY = 'yge_patients';
const CURRENT_USER_KEY = 'yge_currentUser';

// ---------- STORAGE HELPERS ----------
function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getPatients() {
  return JSON.parse(localStorage.getItem(PATIENTS_KEY) || '[]');
}

function savePatients(patients) {
  localStorage.setItem(PATIENTS_KEY, JSON.stringify(patients));
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || 'null');
}

function setCurrentUser(user) {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

// ---------- SIGNUP ----------
function signup(fullname, email, password, role, extra = {}) {
  const users = getUsers();

  // Check duplicate email (case-insensitive)
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    return { success: false, message: 'Email already registered! Please login.' };
  }

  let newId = null;

  if (role === 'patient') {
    const patients = getPatients();

    // Generate next patient ID (P001, P002, ...)
    let maxNum = 0;
    patients.forEach(p => {
      const m = (p.id || '').match(/^P(\d+)$/);
      if (m) maxNum = Math.max(maxNum, parseInt(m[1]));
    });
    newId = 'P' + String(maxNum + 1).padStart(3, '0');

    // Create patient record
    patients.push({
      id: newId,
      fullname: fullname,
      email: email,
      password: password,
      age: extra.age || 'N/A',
      gender: extra.gender || 'N/A',
      phone: extra.phone || 'N/A',
      history: [],
      prescriptions: [],
      labReports: []
    });
    savePatients(patients);
  } else {
    // Admin
    const adminCount = users.filter(u => u.role === 'admin').length;
    newId = 'ADMIN' + String(adminCount + 1).padStart(3, '0');
  }

  // Add user login record
  const newUser = {
    id: newId,
    fullname: fullname,
    email: email,
    password: password,
    role: role
  };
  users.push(newUser);
  saveUsers(users);

  return { success: true, message: 'Signup successful! Please login.' };
}

// ---------- LOGIN ----------
function login(email, password, role) {
  const users = getUsers();

  const found = users.find(
    u => u.email.toLowerCase() === email.toLowerCase() &&
         u.password === password &&
         u.role === role
  );

  if (!found) {
    return {
      success: false,
      message: 'Invalid credentials or wrong role! Please check your email, password and role selection.'
    };
  }

  setCurrentUser({
    id: found.id,
    fullname: found.fullname,
    email: found.email,
    role: found.role
  });

  return { success: true, user: found };
}

// ---------- LOGOUT ----------
function logout() {
  localStorage.removeItem(CURRENT_USER_KEY);
  window.location.href = 'login.html';
}

// ---------- NAVBAR / AUTH UI ----------
function updateAuthUI() {
  const authDiv = document.getElementById('authButtons');
  if (!authDiv) return;

  const user = getCurrentUser();

  if (user) {
    authDiv.innerHTML = `
      <span style="color:#e0f0ff;font-size:0.88rem;display:flex;align-items:center;gap:8px;">
        <i class="fas fa-user-circle"></i> ${user.fullname}
        <span style="background:#6ac9ff20;color:#6ac9ff;padding:3px 10px;border-radius:20px;font-size:0.7rem;font-weight:700;text-transform:uppercase;">
          ${user.role}
        </span>
      </span>
      <button class="btn-outline-light" onclick="logout()">
        <i class="fas fa-sign-out-alt"></i> Logout
      </button>
    `;
  } else {
    authDiv.innerHTML = `
      <a href="login.html" class="btn-outline-light">
        <i class="fas fa-sign-in-alt"></i> Login
      </a>
      <a href="signup.html" class="btn-primary" style="text-decoration:none;">
        <i class="fas fa-user-plus"></i> Sign Up
      </a>
    `;
  }
}

// ---------- ROLE GUARD ----------
function requireRole(role) {
  const user = getCurrentUser();
  if (!user || user.role !== role) {
    window.location.href = 'login.html';
    return null;
  }
  return user;
}

// ---------- AUTO-RUN ON PAGE LOAD ----------
document.addEventListener('DOMContentLoaded', updateAuthUI);