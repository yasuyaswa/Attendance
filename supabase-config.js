// ═══════════════════════════════════════════════════════════
// SUPABASE CONFIGURATION
// ═══════════════════════════════════════════════════════════

const SUPABASE_URL = "https://zhnyfqmdlpqxbpheumkd.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpobnlmcW1kbHBxeGJwaGV1bWtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3MDc4MzAsImV4cCI6MjA4ODI4MzgzMH0.jEBrFm94v9LB0WBmZFwKy22vkRSz9oLL8Fq-dv3MI-o";

const { createClient } = supabase;

const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
  global: {
    headers: {
      "X-Client-Info": "attendance-calendar"
    }
  }
});

// Initialize app
async function initSupabase() {
  try {

    // Test connection
    const { data, error } = await supabaseClient
      .from("attendance")
      .select("*")
      .limit(1);

    if (error) throw error;

    console.log("✅ Supabase connected");

    // Load data
    await loadAndRender();

    // Real-time updates
    supabaseClient
      .channel("attendance_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "attendance"
        },
        () => {
          loadAndRender();
        }
      )
      .subscribe();

  } catch (err) {

    console.error("❌ Supabase connection failed:", err);

    alert(
`Database connection failed.

The app will switch to offline mode (localStorage).`
    );

    window.useLocalStorage = true;
    initLocalStorage();
    await loadAndRender();
  }
}

// LocalStorage fallback
function initLocalStorage() {
  console.log("💾 Using localStorage storage");
}