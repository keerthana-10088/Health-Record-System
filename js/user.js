// js/user.js

document.addEventListener('DOMContentLoaded', function () {
  const user = requireRole('patient');
  if (!user) return;

  // Find this patient's full record
  const allPatients = getPatients();
  const me = allPatients.find(p => p.email.toLowerCase() === user.email.toLowerCase());

  if (!me) {
    document.getElementById('detailSection').innerHTML =
      '<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><h3>No record found</h3><p>Please contact admin.</p></div>';
    return;
  }

  document.getElementById('welcomeLine').textContent =
    `Welcome back, ${me.fullname} · Patient ID: ${me.id}`;

  // ---------- SHOW DETAIL SECTION ----------
  function showDetail(title, icon, html) {
    const sec = document.getElementById('detailSection');
    const titleEl = document.getElementById('detailTitle');
    const content = document.getElementById('detailContent');
    titleEl.innerHTML = `<i class="fas ${icon}"></i> ${title}`;
    content.innerHTML = html;
    sec.style.display = 'block';
    sec.scrollIntoView({ behavior: 'smooth' });
  }

  // ---------- PROFILE ----------
  document.getElementById('profileBtn').onclick = () => {
    showDetail('My Profile', 'fa-id-card', `
      <div class="table-wrapper">
        <table class="data-table">
          <tbody>
            <tr><td style="width:220px;color:#7b95ad;font-weight:600;">Patient ID</td><td><strong>${me.id}</strong></td></tr>
            <tr><td style="color:#7b95ad;font-weight:600;">Full Name</td><td>${me.fullname}</td></tr>
            <tr><td style="color:#7b95ad;font-weight:600;">Email</td><td>${me.email}</td></tr>
            <tr><td style="color:#7b95ad;font-weight:600;">Age</td><td>${me.age}</td></tr>
            <tr><td style="color:#7b95ad;font-weight:600;">Gender</td><td>${me.gender}</td></tr>
            <tr><td style="color:#7b95ad;font-weight:600;">Phone</td><td>${me.phone}</td></tr>
          </tbody>
        </table>
      </div>
    `);
  };

  // ---------- HISTORY ----------
  document.getElementById('historyBtn').onclick = () => {
    const rows = me.history.length
      ? me.history.map(h => `
          <tr>
            <td>${h.date}</td>
            <td><strong>${h.condition}</strong></td>
            <td>${h.notes}</td>
          </tr>`).join('')
      : `<tr><td colspan="3" style="text-align:center; color:#7b95ad; padding:2rem;">No medical history recorded yet.</td></tr>`;

    showDetail('My Medical History', 'fa-history', `
      <div class="table-wrapper">
        <table class="data-table">
          <thead><tr><th>Date</th><th>Condition</th><th>Notes</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `);
  };

  // ---------- PRESCRIPTIONS ----------
  document.getElementById('prescriptionBtn').onclick = () => {
    const rows = me.prescriptions.length
      ? me.prescriptions.map(pr => `
          <tr>
            <td>${pr.date}</td>
            <td><strong>${pr.medicine}</strong></td>
            <td><span class="badge badge-blue">${pr.duration}</span></td>
          </tr>`).join('')
      : `<tr><td colspan="3" style="text-align:center; color:#7b95ad; padding:2rem;">No prescriptions yet.</td></tr>`;

    showDetail('My Prescriptions', 'fa-prescription', `
      <div class="table-wrapper">
        <table class="data-table">
          <thead><tr><th>Date</th><th>Medicine</th><th>Duration</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `);
  };

  // ---------- LAB REPORTS ----------
  document.getElementById('labBtn').onclick = () => {
    const rows = me.labReports.length
      ? me.labReports.map(l => `
          <tr>
            <td>${l.date}</td>
            <td><strong>${l.test}</strong></td>
            <td><span class="badge ${l.result.toLowerCase().includes('normal') ? 'badge-green' : 'badge-orange'}">${l.result}</span></td>
          </tr>`).join('')
      : `<tr><td colspan="3" style="text-align:center; color:#7b95ad; padding:2rem;">No lab reports yet.</td></tr>`;

    showDetail('My Lab Reports', 'fa-flask', `
      <div class="table-wrapper">
        <table class="data-table">
          <thead><tr><th>Date</th><th>Test</th><th>Result</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `);
  };
});