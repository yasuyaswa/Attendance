# 📅 Attendance Calendar

A beautiful, interactive attendance tracking calendar with dark/light theme support. Perfect for tracking office days, work-from-home, leaves, and holidays.

**✨ Features:**
- 📊 Track attendance by day (Office, WFH, Leave, Holiday)
- 🌓 Dark/Light theme toggle
- 🎯 60% office attendance target with pass/fail indicator
- 🌅 Half-day leave support
- 📱 Fully responsive design
- ☁️ **Supabase integration** for shared data across devices
- 💾 **LocalStorage fallback** when Supabase unavailable
- 🚀 **GitHub Pages ready** - works online/offline

---

## 🚀 Quick Start

### Local Development
```bash
node server.js
```
Then visit `http://localhost:3000`

### GitHub Pages Deployment
1. Push this code to GitHub
2. Enable GitHub Pages in repository settings
3. Your app will be live at: `https://<username>.github.io/<repo-name>/`

---

## 📁 File Structure
```
index.html           # Main HTML markup
styles.css           # All styling & themes
script.js            # Frontend logic
supabase-config.js   # Supabase configuration & localStorage fallback
server.js            # Local development server
README.md           # This documentation
```

---

## ☁️ Data Storage

The app uses **Supabase** for shared data storage, with automatic fallback to **localStorage**:

- **Supabase Mode**: Data syncs across devices (requires network access)
- **LocalStorage Mode**: Offline-first, data stored in browser

### Supabase Setup
1. Create free account at [supabase.com](https://supabase.com)
2. Create new project
3. Go to **Settings → API**
4. Add authorized domains:
   - `http://localhost:3000` (local development)
   - `https://<username>.github.io` (GitHub Pages)
5. Copy URL and anon key to `supabase-config.js`
6. Create `attendance` table with columns: `id` (auto), `date` (text), `status` (text)

---

## 🎯 How It Works
- Click any date to mark attendance
- Choose from: Office, WFH, Leave, Holiday, or Half-day options
- View statistics and 60% office target progress
- Data automatically saves and syncs (when Supabase available)

### Tracking Options
- **Office** - Full day in office
- **WFH** - Work From Home
- **Leave** - Full day leave
- **Holiday** - Public/organizational holiday (with name)
- **Half-day Leave** - Combined with office/WFH for afternoon/morning

### Pass/Fail Logic
- **Target:** 60% of working days in office
- **Current month:** Judges only days up to today
- **Past/future months:** Judges full month
- Automatically excludes weekends, leaves, and holidays

---

## 🎨 Customization

### Change Office Target
Edit `script.js`, find:
```javascript
const tgt = eff * 0.6;  // Change 0.6 to desired percentage
```

### Change Colors
Edit `styles.css` - modify the CSS custom properties in the `:root` section.

---

## 🌐 Browser Support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers

---

## 📊 Data Backup
To backup localStorage data:
1. Open DevTools Console (F12)
2. Run: `copy(localStorage.getItem('attendance_data'))`
3. Save the copied data to a file

To restore:
1. Run: `localStorage.setItem('attendance_data', 'PASTE_YOUR_DATA_HERE')`
2. Refresh the page

---

## 📄 License

Free to use and modify!

---

## 💬 Notes

- Data is **private** to your browser (not sent to any server on GitHub Pages)
- Each device/browser has **separate data**
- To sync across devices, manually backup/restore using DevTools
- Works **completely offline** once loaded

---

**Made with ❤️ for attendance tracking**
