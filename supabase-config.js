// ═══════════════════════════════════════════════════════════
// LOCAL STORAGE CONFIGURATION (FALLBACK)
// ═══════════════════════════════════════════════════════════
// Since Supabase connection is blocked by network/firewall,
// we're using localStorage for data persistence.
// This works offline and across browser sessions on the same device.

let localData = {};

// Load data from localStorage
function loadLocalData() {
  try {
    const stored = localStorage.getItem('attendance_data');
    if (stored) {
      localData = JSON.parse(stored);
    }
  } catch (err) {
    console.warn('Failed to load local data:', err);
    localData = {};
  }
}

// Save data to localStorage
function saveLocalData() {
  try {
    localStorage.setItem('attendance_data', JSON.stringify(localData));
  } catch (err) {
    console.error('Failed to save local data:', err);
  }
}

// Initialize app (localStorage version)
async function initSupabase() {
  loadLocalData();
  await loadAndRender();

  // No realtime needed for localStorage
}
