// js/admin.js

document.addEventListener('DOMContentLoaded', function () {
  const user = requireRole('admin');
  if (!user) return;

  let patients = getPatients();
  let currentView = 'dashboard';
  let currentPatientId = null;

  // ---------- ELEMENTS ----------
  const grid = document.getElementById('dashboardGrid');
  const detailSection = document.getElementById('detailSection');
  const detailTitle = document.getElementById('detailTitle');
  const detailContent = document.getElementById('detailContent');
  const backBtn = document.getElementById('backBtn');
  const recordModal = document.getElementById('recordModal');
  const recordForm = document.getElementById('recordForm');

  // ---------- RENDER PATIENTS TABLE ----------
  function renderPatientsTable() {
    patients = getPatients();
    return `
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Phone</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${patients.map(p => `
              <tr>
                <td><span class="badge badge-blue">${p.id}</span></td>
                <td><strong>${p.fullname}</strong></td>
                <td>${p.email}</td>
                <td>${p.age}</td>
                <td>${p.gender}</td>
                <td>${p.phone}</td>
                <td>
                  <button class="mini-btn" onclick="openRecordModal('${p.id}')">
                    <i class="fas fa-plus-circle"></i> Add Record
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // ---------- RENDER HISTORY TABLE ----------
  function renderHistoryTable() {
    return `
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Date</th>
              <th>Condition</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            ${patients.flatMap(p => {
              if (!p.history || p.history.length === 0) {
                return [`
                  <tr>
                    <td><strong>${p.fullname}</strong><br><small style="color:#7b95ad;">${p.id}</small></td>
                    <td colspan="3" style="color:#7b95ad; font-style:italic;">No history recorded</td>
                  </tr>
                `];
              }
              return p.history.map(h => `
                <tr>
                  <td><strong>${p.fullname}</strong><br><small style="color:#7b95ad;">${p.id}</small></td>
                  <td>${h.date}</td>
                  <td><strong>${h.condition}</strong></td>
                  <td>${h.notes}</td>
                </tr>
              `);
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // ---------- RENDER PRESCRIPTIONS TABLE ----------
  function renderPrescriptionsTable() {
    return `
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Date</th>
              <th>Medicine</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            ${patients.flatMap(p => {
              if (!p.prescriptions || p.prescriptions.length === 0) {
                return [`
                  <tr>
                    <td><strong>${p.fullname}</strong><br><small style="color:#7b95ad;">${p.id}</small></td>
                    <td colspan="3" style="color:#7b95ad; font-style:italic;">No prescriptions</td>
                  </tr>
                `];
              }
              return p.prescriptions.map(pr => `
                <tr>
                  <td><strong>${p.fullname}</strong><br><small style="color:#7b95ad;">${p.id}</small></td>
                  <td>${pr.date}</td>
                  <td><strong>${pr.medicine}</strong></td>
                  <td><span class="badge badge-blue">${pr.duration}</span></td>
                </tr>
              `);
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // ---------- RENDER LABS TABLE ----------
  function renderLabsTable() {
    return `
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Date</th>
              <th>Test</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            ${patients.flatMap(p => {
              if (!p.labReports || p.labReports.length === 0) {
                return [`
                  <tr>
                    <td><strong>${p.fullname}</strong><br><small style="color:#7b95ad;">${p.id}</small></td>
                    <td colspan="3" style="color:#7b95ad; font-style:italic;">No lab reports</td>
                  </tr>
                `];
              }
              return p.labReports.map(l => `
                <tr>
                  <td><strong>${p.fullname}</strong><br><small style="color:#7b95ad;">${p.id}</small></td>
                  <td>${l.date}</td>
                  <td><strong>${l.test}</strong></td>
                  <td>
                    <span class="badge ${l.result.toLowerCase().includes('normal') ? 'badge-green' : 'badge-orange'}">
                      ${l.result}
                    </span>
                  </td>
                </tr>
              `);
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // ---------- SWITCH VIEWS ----------
  function showView(view) {
    currentView = view;

    if (view === 'dashboard') {
      grid.style.display = 'grid';
      detailSection.style.display = 'none';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    grid.style.display = 'none';
    detailSection.style.display = 'block';

    let title = '', icon = '', content = '';

    if (view === 'patients') {
      title = 'All Registered Patients';
      icon = 'fa-users';
      content = renderPatientsTable();
    } else if (view === 'history') {
      title = 'All Patients Medical History';
      icon = 'fa-notes-medical';
      content = renderHistoryTable();
    } else if (view === 'prescriptions') {
      title = 'All Prescriptions';
      icon = 'fa-prescription';
      content = renderPrescriptionsTable();
    } else if (view === 'labs') {
      title = 'All Lab Reports';
      icon = 'fa-flask';
      content = renderLabsTable();
    }

    detailTitle.innerHTML = `<i class="fas ${icon}"></i> ${title}`;
    detailContent.innerHTML = content;

    const addBtn = document.getElementById('addPatientInlineBtn');
    if (addBtn) {
      addBtn.style.display = view === 'patients' ? 'inline-flex' : 'none';
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ---------- NAV LISTENERS ----------
  document.getElementById('viewPatientsBtn').onclick = () => showView('patients');
  document.getElementById('viewHistoryBtn').onclick = () => showView('history');
  document.getElementById('viewPrescriptionsBtn').onclick = () => showView('prescriptions');
  document.getElementById('viewLabsBtn').onclick = () => showView('labs');
  backBtn.onclick = () => showView('dashboard');

  // ---------- ADD PATIENT MODAL ----------
  const modal = document.getElementById('modalOverlay');
  [document.getElementById('addPatientBtn'), document.getElementById('addPatientInlineBtn')]
    .forEach(btn => { if (btn) btn.onclick = () => modal.classList.add('active'); });

  document.getElementById('modalClose').onclick = () => modal.classList.remove('active');
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });

  // ---------- ADD PATIENT SUBMIT ----------
  document.getElementById('addPatientForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const fullname = document.getElementById('pName').value.trim();
    const email = document.getElementById('pEmail').value.trim();
    const password = document.getElementById('pPassword').value;
    const age = document.getElementById('pAge').value;
    const gender = document.getElementById('pGender').value.trim();
    const phone = document.getElementById('pPhone').value.trim();
    const condition = document.getElementById('pCondition').value.trim();
    const prescription = document.getElementById('pPrescription').value.trim();
    const lab = document.getElementById('pLab').value.trim();

    const users = getUsers();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      alert('❌ A user with this email already exists!');
      return;
    }

    const allPatients = getPatients();
    let maxNum = 0;
    allPatients.forEach(p => {
      const m = (p.id || '').match(/^P(\d+)$/);
      if (m) maxNum = Math.max(maxNum, parseInt(m[1]));
    });
    const newId = 'P' + String(maxNum + 1).padStart(3, '0');
    const today = new Date().toISOString().split('T')[0];

    const newPatient = {
      id: newId,
      fullname, email, password, age, gender, phone,
      history: condition ? [{ date: today, condition, notes: 'Initial consultation' }] : [],
      prescriptions: prescription ? [{ date: today, medicine: prescription, duration: '30 days' }] : [],
      labReports: lab ? [{ date: today, test: lab, result: 'Pending' }] : []
    };

    allPatients.push(newPatient);
    savePatients(allPatients);

    users.push({ id: newId, fullname, email, password, role: 'patient' });
    saveUsers(users);

    alert(`✅ Patient "${fullname}" added successfully!\n\nLogin:\nEmail: ${email}\nPassword: ${password}`);

    modal.classList.remove('active');
    this.reset();
    document.getElementById('pPassword').value = '1234';

    patients = getPatients();
    showView('patients');
  });

  // ==========================================================
  //   RECORD MODAL — Add history / prescription / lab
  // ==========================================================

  // ---------- OPEN RECORD MODAL ----------
  window.openRecordModal = function (patientId) {
    const patient = getPatients().find(p => p.id === patientId);
    if (!patient) return;

    currentPatientId = patientId;
    document.getElementById('rPatientName').value = `${patient.fullname} (${patient.id})`;
    document.getElementById('rDate').value = new Date().toISOString().split('T')[0];

    // Reset type to history and render its fields
    document.getElementById('rType').value = 'history';
    renderDynamicFields('history');

    // Reset all inputs
    setTimeout(() => {
      document.querySelectorAll('#dynamicFields input').forEach(i => i.value = '');
    }, 0);

    renderExistingRecords(patient);
    recordModal.classList.add('active');
  };

  document.getElementById('recordModalClose').onclick = () => recordModal.classList.remove('active');
  recordModal.addEventListener('click', (e) => {
    if (e.target === recordModal) recordModal.classList.remove('active');
  });

  // ---------- RENDER DYNAMIC FIELDS (based on explicit type param) ----------
  function renderDynamicFields(type) {
    const container = document.getElementById('dynamicFields');
    // Use the passed type, or fallback to select value
    const t = type || document.getElementById('rType').value;

    if (t === 'history') {
      container.innerHTML = `
        <div class="form-group full">
          <label>Condition</label>
          <input type="text" id="dCondition" placeholder="e.g. Hypertension" required>
        </div>
        <div class="form-group full">
          <label>Notes</label>
          <input type="text" id="dNotes" placeholder="e.g. BP 150/95" required>
        </div>
      `;
    } else if (t === 'prescription') {
      container.innerHTML = `
        <div class="form-group full">
          <label>Medicine</label>
          <input type="text" id="dMedicine" placeholder="e.g. Lisinopril 10mg" required>
        </div>
        <div class="form-group full">
          <label>Duration</label>
          <input type="text" id="dDuration" placeholder="e.g. 30 days" required>
        </div>
      `;
    } else if (t === 'lab') {
      container.innerHTML = `
        <div class="form-group full">
          <label>Test Name</label>
          <input type="text" id="dTest" placeholder="e.g. Complete Blood Count" required>
        </div>
        <div class="form-group full">
          <label>Result</label>
          <input type="text" id="dResult" placeholder="e.g. Normal / High" required>
        </div>
      `;
    }
  }

  // Change event on select — pass the new value explicitly
  document.getElementById('rType').addEventListener('change', function () {
    renderDynamicFields(this.value);
  });

  // ---------- EXISTING RECORDS PREVIEW ----------
  function renderExistingRecords(patient) {
    const container = document.getElementById('existingRecords');
    const h = patient.history || [];
    const pr = patient.prescriptions || [];
    const lb = patient.labReports || [];

    if (h.length === 0 && pr.length === 0 && lb.length === 0) {
      container.innerHTML = '<p style="color:#7b95ad; font-style:italic;">No records yet. Add the first one above.</p>';
      return;
    }

    let html = '';
    if (h.length) {
      html += `<p style="font-weight:700; color:#0a2a44; margin-bottom:4px;">📋 History (${h.length})</p>`;
      h.forEach(x => html += `<div style="padding:4px 0; border-bottom:1px solid #eef4fb;">${x.date} · <strong>${x.condition}</strong> · ${x.notes}</div>`);
    }
    if (pr.length) {
      html += `<p style="font-weight:700; color:#0a2a44; margin:8px 0 4px;">💊 Prescriptions (${pr.length})</p>`;
      pr.forEach(x => html += `<div style="padding:4px 0; border-bottom:1px solid #eef4fb;">${x.date} · <strong>${x.medicine}</strong> · ${x.duration}</div>`);
    }
    if (lb.length) {
      html += `<p style="font-weight:700; color:#0a2a44; margin:8px 0 4px;">🧪 Lab Reports (${lb.length})</p>`;
      lb.forEach(x => html += `<div style="padding:4px 0; border-bottom:1px solid #eef4fb;">${x.date} · <strong>${x.test}</strong> · ${x.result}</div>`);
    }
    container.innerHTML = html;
  }

  // ==========================================================
  //   RECORD FORM SUBMIT — handles all three types
  // ==========================================================
  recordForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const type = document.getElementById('rType').value;
    const date = document.getElementById('rDate').value;

    if (!date) {
      alert('⚠️ Please select a date.');
      return;
    }

    const allPatients = getPatients();
    const idx = allPatients.findIndex(p => p.id === currentPatientId);
    if (idx === -1) {
      alert('❌ Patient not found.');
      return;
    }

    const patient = allPatients[idx];

    // === HISTORY ===
    if (type === 'history') {
      const conditionEl = document.getElementById('dCondition');
      const notesEl = document.getElementById('dNotes');

      if (!conditionEl || !notesEl) {
        alert('❌ Form fields missing. Please reopen the modal.');
        return;
      }

      const condition = conditionEl.value.trim();
      const notes = notesEl.value.trim();

      if (!condition) {
        alert('⚠️ Please enter a condition.');
        return;
      }

      if (!patient.history) patient.history = [];
      patient.history.push({ date, condition, notes: notes || '—' });
    }

    // === PRESCRIPTION ===
    else if (type === 'prescription') {
      const medicineEl = document.getElementById('dMedicine');
      const durationEl = document.getElementById('dDuration');

      if (!medicineEl || !durationEl) {
        alert('❌ Form fields missing. Please reopen the modal.');
        return;
      }

      const medicine = medicineEl.value.trim();
      const duration = durationEl.value.trim();

      if (!medicine) {
        alert('⚠️ Please enter a medicine name.');
        return;
      }

      if (!patient.prescriptions) patient.prescriptions = [];
      patient.prescriptions.push({ date, medicine, duration: duration || '—' });
    }

    // === LAB REPORT ===
    else if (type === 'lab') {
      const testEl = document.getElementById('dTest');
      const resultEl = document.getElementById('dResult');

      if (!testEl || !resultEl) {
        alert('❌ Form fields missing. Please reopen the modal.');
        return;
      }

      const test = testEl.value.trim();
      const result = resultEl.value.trim();

      if (!test) {
        alert('⚠️ Please enter a test name.');
        return;
      }

      if (!patient.labReports) patient.labReports = [];
      patient.labReports.push({ date, test, result: result || 'Pending' });
    }

    // Save back to localStorage
    allPatients[idx] = patient;
    savePatients(allPatients);

    // Refresh patients list
    patients = getPatients();

    // Show success message
    const typeLabel = {
      history: 'Medical history',
      prescription: 'Prescription',
      lab: 'Lab report'
    }[type];

    alert(`✅ ${typeLabel} added to ${patient.fullname}!\n\nPatient will see this update on their dashboard.`);

    // Refresh the existing records preview
    renderExistingRecords(patients[idx]);

    // Clear dynamic fields
    document.querySelectorAll('#dynamicFields input').forEach(i => i.value = '');
  });

  // ---------- INITIAL RENDER ----------
  showView('dashboard');
});