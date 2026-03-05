// ═══════════════════════════════════════════════════════════
// SUPABASE CONFIGURATION
// ═══════════════════════════════════════════════════════════
//
// Get these values from Supabase:
// 1. Go to https://supabase.com (free sign up)
// 2. Create a new project
// 3. Go to Settings → API
// 4. Copy the ANON KEY and PROJECT URL below
//
// IMPORTANT: Add these domains to "Authorized domains" in Supabase:
// - http://localhost:3000 (for local testing)
// - https://yasuyaswa.github.io (for GitHub Pages)
//
// ═══════════════════════════════════════════════════════════

const SUPABASE_URL = "https://zhnyfqmdlpqxbpheumkd.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpobnlmcW1kbHBxeGJwaGV1bWtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3MDc4MzAsImV4cCI6MjA4ODI4MzgzMH0.jEBrFm94v9LB0WBmZFwKy22vkRSz9oLL8Fq-dv3MI-o";

// Initialize Supabase client
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false
  },
  global: {
    headers: {
      'X-Client-Info': 'attendance-calendar'
    }
  }
});

// Initialize app
async function initSupabase() {
  try {
    // Test basic connectivity
    const { data: testData, error: testError } = await supabaseClient
      .from('attendance')
      .select('count')
      .limit(1);

    if (testError) throw testError;

    // Load initial data
    await loadAndRender();

    // Listen for real-time changes
    supabaseClient
      .channel('attendance_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'attendance'
        },
        (payload) => {
          loadAndRender();
        }
      )
      .subscribe();

  } catch (err) {
    // Show user-friendly error message
    let errorMsg = 'Unknown error occurred';
    if (err.message?.includes('Failed to fetch')) {
      errorMsg = 'Network error: Cannot connect to Supabase. Check your internet connection and firewall settings.';
    } else if (err.message?.includes('CORS') || err.message?.includes('cross-origin')) {
      errorMsg = 'CORS error: Add your domain to Supabase authorized domains. Go to Settings → API → Authorized domains and add: https://yasuyaswa.github.io';
    } else if (err.message) {
      errorMsg = `Database error: ${err.message}`;
    }

    alert(`Failed to connect to database:\n\n${errorMsg}\n\nThe app will work in offline mode with localStorage.`);

    // Fallback to localStorage
    window.useLocalStorage = true;
    initLocalStorage();
    // Load data in localStorage mode
    await loadAndRender();
  }
}

// LocalStorage fallback
function initLocalStorage() {
  console.log('💾 Using localStorage for data storage');
  // This will be called if Supabase fails
}
