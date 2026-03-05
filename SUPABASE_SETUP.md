# 🚀 Supabase Setup Guide

Deploy your Attendance Calendar to GitHub Pages with **Supabase** as the shared database.

---

## 📋 Prerequisites

- GitHub account
- Supabase account (free at https://supabase.com)

---

## 🔧 Step 1: Create Supabase Project

1. **Sign up/Login to Supabase:** https://supabase.com
2. **Create a new project:**
   - Click "New project"
   - Name: `attendance-calendar` (or whatever you prefer)
   - Database password: Create a strong password
   - Region: Choose closest to you
   - Click "Create new project"

3. **Wait for project creation** (1-2 minutes)

---

## 📊 Step 2: Create Database Table

1. **Go to SQL Editor**
2. **Click "New query"**
3. **Paste this SQL:**

```sql
-- Create attendance table
CREATE TABLE attendance (
  id BIGSERIAL PRIMARY KEY,
  date TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_attendance_date ON attendance(date);

-- Enable Row Level Security (RLS)
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- Allow public read/write (anyone with the URL can access)
CREATE POLICY "Allow public access" ON attendance
  FOR ALL USING (true) WITH CHECK (true);
```

4. **Click "Run"** (green play button)
5. **Verify:** Go to **Table Editor** → You should see `attendance` table

---

## 🔑 Step 3: Get Your API Keys

1. **Go to Settings → API**
2. **Copy these values:**
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **Anon Public Key** (under "Project API keys")

---

## 📝 Step 4: Configure Your App

1. **Open `supabase-config.js`** in your editor
2. **Replace the values:**

```javascript
const SUPABASE_URL = "YOUR_SUPABASE_URL";      // Paste Project URL
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";  // Paste Anon Key
```

**Example:**
```javascript
const SUPABASE_URL = "https://abcdefghijk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
```

3. **Save the file**

---

## 🚀 Step 5: Deploy to GitHub Pages

1. **Add and commit files:**
```bash
git add .
git commit -m "Add Supabase integration"
git push origin main
```

2. **Enable GitHub Pages:**
   - Go to **Settings → Pages**
   - Source: **Deploy from a branch**
   - Branch: **main**, folder: **/root**
   - Click **Save**

3. **Get your live URL:**
   - Wait 1-2 minutes for deployment
   - Go to **Settings → Pages**
   - Your URL: `https://yasuyaswa.github.io/Attendance/`

---

## ✅ Test Your App

1. **Open your app** at the GitHub Pages URL
2. **Click a day** to mark attendance
3. **Open in another browser/device** at the same URL
4. **Verify data is shared** - changes appear instantly!

---

## 🔒 Security Notes

### Current Setup
- **Anyone with your GitHub Pages URL can see and edit data**
- Good for: Team/personal use where privacy isn't critical

### For Private Data
Add authentication to Supabase:

1. **Go to Authentication → Users**
2. **Enable email/password signup**
3. **Update script.js** to require login:

```javascript
// Add before loadAndRender():
async function checkAuth() {
  const { data } = await supabaseClient.auth.getSession();
  if (!data.session) {
    // Redirect to login page
    window.location.href = '/login.html';
  }
}
```

---

## 📊 View Your Data

### Option 1: Supabase Dashboard
1. Go to Supabase Console
2. Go to **Table Editor**
3. Click **attendance** table
4. View all records

### Option 2: API Endpoint
Visit this URL in browser (replace with your URL):
```
https://[YOUR_SUPABASE_URL]/rest/v1/attendance?apikey=[YOUR_ANON_KEY]
```

---

## 🔄 Data Sync

Your app uses **real-time subscriptions**, so:
- ✅ Changes sync instantly across devices
- ✅ No need to refresh
- ✅ Works offline (saves locally, syncs when online)

---

## ⚙️ Troubleshooting

### "Failed to load data"
- Check SUPABASE_URL and SUPABASE_ANON_KEY in supabase-config.js
- Ensure table is created (run SQL query again)
- Check browser console (F12) for errors

### "Not authorized"
- Check RLS policies are set to allow public access
- Go to **Tables → attendance → RLS → Policies**
- Ensure "Allow public access" policy exists

### "Changes not syncing"
- Check browser DevTools (F12) for errors
- Verify Supabase project is active
- Try refreshing the page

### "Table not found"
- Go to SQL Editor
- Run the CREATE TABLE query again
- Verify syntax is correct

---

## 📱 Multi-Device Sync

Your app now supports:
✅ Desktop → Mobile sync  
✅ Chrome → Firefox sync  
✅ Real-time updates  
✅ Works offline  

Just open the same URL on any device and it works!

---

## 💾 Backup Data

Export data as CSV/JSON:

```sql
-- Run in Supabase SQL Editor to see all data
SELECT * FROM attendance ORDER BY date DESC;

-- Copy and save to a file
```

Or use Supabase backup features in Settings.

---

## 🎉 You're Done!

Your app is now:
- ✅ Deployed on GitHub Pages
- ✅ Using Supabase for shared data
- ✅ Accessible from any device
- ✅ Real-time synced

**Share the URL with your team and start tracking attendance!**

---

**Need help?** Check browser console (F12) for error messages.
