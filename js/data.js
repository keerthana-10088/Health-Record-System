// js/data.js
// Robust seeding: adds defaults ONLY if they don't exist. Never overwrites.

const DEFAULT_ADMIN = {
  id: 'ADMIN001',
  fullname: 'Dr. Admin',
  email: 'admin@yge.com',
  password: 'admin123',
  role: 'admin'
};

const DEFAULT_PATIENTS = [
  {
    id: 'P001',
    fullname: 'Ravi Kumar',
    email: 'ravi@yge.com',
    password: '1234',
    age: 45,
    gender: 'Male',
    phone: '9876543210',
    history: [
      { date: '2025-01-10', condition: 'Hypertension', notes: 'BP 150/95' },
      { date: '2025-03-22', condition: 'Type 2 Diabetes', notes: 'Sugar 210 mg/dL' }
    ],
    prescriptions: [
      { date: '2025-01-10', medicine: 'Lisinopril 10mg', duration: '30 days' },
      { date: '2025-03-22', medicine: 'Metformin 500mg', duration: '60 days' }
    ],
    labReports: [
      { date: '2025-01-12', test: 'Complete Blood Count', result: 'Normal' },
      { date: '2025-03-25', test: 'HbA1c', result: 'High' }
    ]
  },
  {
    id: 'P002',
    fullname: 'Priya Sharma',
    email: 'priya@yge.com',
    password: '1234',
    age: 32,
    gender: 'Female',
    phone: '9876543211',
    history: [{ date: '2024-11-05', condition: 'Anemia', notes: 'Hb 9.2 g/dL' }],
    prescriptions: [{ date: '2024-11-05', medicine: 'Ferrous Sulfate 200mg', duration: '90 days' }],
    labReports: [{ date: '2024-11-06', test: 'Iron Studies', result: 'Low Ferritin' }]
  },
  {
    id: 'P003',
    fullname: 'Arjun Reddy',
    email: 'arjun@yge.com',
    password: '1234',
    age: 28,
    gender: 'Male',
    phone: '9876543212',
    history: [{ date: '2025-02-14', condition: 'Asthma', notes: 'Mild persistent' }],
    prescriptions: [{ date: '2025-02-14', medicine: 'Salbutamol Inhaler', duration: 'As needed' }],
    labReports: [{ date: '2025-02-15', test: 'Pulmonary Function', result: 'FEV1 78%' }]
  },
  {
    id: 'P004',
    fullname: 'Sneha Patel',
    email: 'sneha@yge.com',
    password: '1234',
    age: 41,
    gender: 'Female',
    phone: '9876543213',
    history: [{ date: '2024-08-20', condition: 'Hypothyroidism', notes: 'TSH 6.5' }],
    prescriptions: [{ date: '2024-08-20', medicine: 'Levothyroxine 50mcg', duration: 'Ongoing' }],
    labReports: [{ date: '2024-08-22', test: 'Thyroid Panel', result: 'TSH Elevated' }]
  },
  {
    id: 'P005',
    fullname: 'Vikram Singh',
    email: 'vikram@yge.com',
    password: '1234',
    age: 55,
    gender: 'Male',
    phone: '9876543214',
    history: [
      { date: '2025-04-01', condition: 'High Cholesterol', notes: 'LDL 180' },
      { date: '2025-04-01', condition: 'Obesity', notes: 'BMI 31' }
    ],
    prescriptions: [{ date: '2025-04-01', medicine: 'Atorvastatin 20mg', duration: '90 days' }],
    labReports: [{ date: '2025-04-03', test: 'Lipid Profile', result: 'LDL High' }]
  }
];

// ---------- SMART SEEDING ----------
// Adds default records ONLY if they don't already exist. Never overwrites user data.
function seedDefaultData() {
  let users = JSON.parse(localStorage.getItem('yge_users') || '[]');
  let patients = JSON.parse(localStorage.getItem('yge_patients') || '[]');

  // 1. Ensure ADMIN user exists
  if (!users.find(u => u.email.toLowerCase() === DEFAULT_ADMIN.email.toLowerCase())) {
    users.push({ ...DEFAULT_ADMIN });
  }

  // 2. Ensure all 5 default patients exist (as users + patient records)
  DEFAULT_PATIENTS.forEach(dp => {
    // Add user login if missing
    if (!users.find(u => u.email.toLowerCase() === dp.email.toLowerCase())) {
      users.push({
        id: dp.id,
        fullname: dp.fullname,
        email: dp.email,
        password: dp.password,
        role: 'patient'
      });
    }
    // Add patient record if missing
    if (!patients.find(p => p.id === dp.id)) {
      patients.push({ ...dp });
    }
  });

  localStorage.setItem('yge_users', JSON.stringify(users));
  localStorage.setItem('yge_patients', JSON.stringify(patients));
}

// Run seeding immediately
seedDefaultData();