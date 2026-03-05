// ═══════════════════════════════════════════════════════════
// FIREBASE CONFIGURATION
// ═══════════════════════════════════════════════════════════
// 
// Get these values from Firebase Console:
// 1. Go to https://console.firebase.google.com
// 2. Create a new project or select existing one
// 3. Go to Project Settings (⚙️)
// 4. Copy the Web App config values below
//
// ═══════════════════════════════════════════════════════════

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get reference to database
const db = firebase.database();
const attendanceRef = db.ref('attendance');

// Initialize app
function initFirebase() {
  // Listen for data changes
  attendanceRef.on('value', (snapshot) => {
    const data = snapshot.val();
    D = data || {};
    render();
  });
}
