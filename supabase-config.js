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
// ═══════════════════════════════════════════════════════════

const SUPABASE_URL = "https://zhnyfqmdlpqxbpheumkd.supabase.co";  // e.g., https://xxxxx.supabase.co
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpobnlmcW1kbHBxeGJwaGV1bWtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3MDc4MzAsImV4cCI6MjA4ODI4MzgzMH0.jEBrFm94v9LB0WBmZFwKy22vkRSz9oLL8Fq-dv3MI-o";

// Initialize Supabase client
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Initialize app
async function initSupabase() {
  try {
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
          // Reload data when database changes
          loadAndRender();
        }
      )
      .subscribe();
  } catch (err) {
    console.error('Supabase init error:', err);
  }
}
