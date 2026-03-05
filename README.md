# 📅 Attendance Calendar

A beautiful, interactive attendance tracking calendar with dark/light theme support. Perfect for tracking office days, work-from-home, leaves, and holidays.

**✨ Features:**
- 📊 Track attendance by day (Office, WFH, Leave, Holiday)
- 🌓 Dark/Light theme toggle
- 🎯 60% office attendance target with pass/fail indicator
- 🌅 Half-day leave support
- 📱 Fully responsive design
- 💾 Data persists in browser (LocalStorage)
- 🚀 No backend required - works offline!

---

## 🚀 Quick Start

### Local Development

1. **Open in browser:** Simply open `attendance.html` in your browser, or
2. **Use local server** (optional):
   ```bash
   node server.js
   ```
   Then visit `http://localhost:3000`

### GitHub Pages Deployment

1. **Create a GitHub repository** and push this code
2. **Enable GitHub Pages:**
   - Go to **Settings → Pages**
   - Select **Deploy from a branch**
   - Choose **main** branch and **/root** folder
   - Click **Save**

3. **Your app will be live at:**
   ```
   https://<username>.github.io/<repo-name>/
   ```

---

## 📁 File Structure

```
attendance.html       # Main HTML markup
styles.css           # All styling & themes
script.js            # Frontend logic & localStorage
.gitignore          # Git ignore rules
README.md           # This file
server.js           # Optional: local development server
attendance.json     # Optional: initial data seed
```

---

## 💡 How It Works

### Data Storage
- **Browser LocalStorage** stores all attendance data
- Data persists across browser sessions
- No account required
- Each browser/device has separate data

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
- Automatically excludes weekends, leaves, and holidays from calculation

---

## 🎨 Customization

### Change Theme Colors
Edit `styles.css` - Look for the theme tokens section:
```css
:root, [data-theme="light"] {
  --accent: #2563eb;      /* Change primary color */
  --c-office: #2563eb;    /* Office color */
  --c-wfh: #059669;       /* WFH color */
  --c-leave: #d97706;     /* Leave color */
  --c-hday: #7c3aed;      /* Holiday color */
  /* ... more colors ... */
}
```

### Change Office Target
Edit `script.js`, find the pass/fail logic:
```javascript
const tgt = eff * 0.6;  // Change 0.6 to desired percentage (e.g., 0.7 for 70%)
```

---

## 📝 Usage

### Mark a Day
1. Click on any workday (non-weekend) in the calendar
2. Select the attendance type from the popup
3. Changes auto-save to browser storage

### Clear a Day
1. Click on the marked day
2. Select "Clear / Unmark"

### Add Holiday
1. Click on a day
2. Select "Holiday"
3. Enter the holiday name
4. Click "✓ Save Holiday"

### Half-Day Leave
1. Click on a day
2. Select "First Half Leave (AM)" or "Second Half Leave (PM)"
3. Choose the work mode for the other half (Office or WFH)

---

## 🌐 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## 📊 Data Backup

To backup your data:
1. Open browser DevTools (F12)
2. Go to **Console**
3. Run: `copy(localStorage.getItem('attendance_data'))`
4. Paste into a text file to save

To restore:
1. Open DevTools Console
2. Run: `localStorage.setItem('attendance_data', '<PASTE_YOUR_DATA_HERE>')`
3. Refresh the page

---

## 🔧 Local Server Setup (Optional)

For multi-user shared data:

```bash
# Install Node.js (if not already installed)
# Run the server:
node server.js

# Visit http://localhost:3000
```

**Note:** Server.js is for local development only. GitHub Pages doesn't support backends.

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
