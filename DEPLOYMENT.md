# 🚀 Deployment Guide

Your Attendance Calendar uses **attendance.json** to store shared data. All devices accessing the same server will see the same data.

---

## 📍 Where Data is Stored

- **File:** `attendance.json` on your server
- **Shared:** Yes - all users/devices see the same data
- **Format:** JSON
- **Location:** Server's root directory

---

## ✅ Free Deployment Options

### **Option 1: Railway (Recommended - Easiest)**

1. **Create Railway account:** https://railway.app
2. **Connect GitHub:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Authorize and select `Attendance` repo

3. **Deploy:**
   - Railway auto-detects Node.js
   - Click "Deploy"
   - Your app is live! Get the URL from "Deployments"

4. **Result:** 
   ```
   https://[project-name].up.railway.app
   ```

**Free tier:** 500 hours/month (enough for always-on server)

---

### **Option 2: Render**

1. **Create Render account:** https://render.com
2. **New Web Service:**
   - Connect GitHub repo
   - Build command: `npm install` (if needed)
   - Start command: `node server.js`
   - Runtime: Node

3. **Deploy:** Click "Create Web Service"

4. **Result:**
   ```
   https://[your-service].onrender.com
   ```

**Free tier:** Auto-sleeps after 15 min inactivity (wake on request)

---

### **Option 3: Heroku (formerly free, now paid)**

Similar to above, but requires payment now.

---

## 📋 Setup Steps (All Platforms)

1. **Ensure `server.js` exists** in your repo
2. **Ensure `attendance.json` exists** (data file)
3. **Add `package.json`** (if not present):

```json
{
  "name": "attendance-calendar",
  "version": "1.0.0",
  "description": "Shared attendance calendar",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "engines": {
    "node": "18"
  }
}
```

4. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Add deployment files"
   git push origin main
   ```

5. **Deploy on your chosen platform** (see options above)

---

## 🔄 How It Works

### Frontend
- Runs in browser
- Loads data from `/api/attendance` endpoint
- Sends changes to `/api/attendance` POST endpoint

### Backend (server.js)
- Reads/writes from `attendance.json`
- Serves static files (HTML, CSS, JS)
- All data is **shared** across all connected devices

### Data Flow
```
User A (Browser) ──┐
                    ├──→ Server (Node.js) ──→ attendance.json
User B (Browser) ──┘                          (Shared Data)
```

---

## 🌐 Access Your App

After deployment, you'll get a URL like:
```
https://attendance-calendar.up.railway.app
```

**Important:** 
- All users access the **same URL**
- All users see **same data** in `attendance.json`
- Changes are **instantly synced**

---

## 📊 View/Export Data

### In Browser Console:
```javascript
// View current data in memory
console.log(D)

// Download as JSON file
const data = localStorage.getItem('attendance_data') || JSON.stringify(D);
const blob = new Blob([data], {type: 'application/json'});
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'attendance-backup.json';
a.click();
```

### Or Visit API:
```
https://your-server.com/api/attendance
```
This returns the raw JSON data.

---

## 🔐 Security Notes

- **Data is public** - Anyone with the URL can see/edit data
- For **private use:** Keep URL secret or add authentication
- For **production:** Consider adding password protection to server.js

---

## 💾 Backup Data

Keep a copy of `attendance.json`:

```bash
# Before deploying, backup locally
git clone https://github.com/yasuyaswa/Attendance.git backup
cp backup/attendance.json attendance-backup.json
```

Or download from deployed server:
1. Visit your server URL
2. Go to `/api/attendance`
3. Save the JSON response

---

## 🛠️ Troubleshooting

### "Cannot find module"
- Ensure `package.json` exists
- Platform should auto-install dependencies

### "Port error"
- Railway/Render set `PORT` env variable automatically
- server.js uses `process.env.PORT || 3000` ✓

### "File not found"
- Ensure `attendance.json` is in root directory
- Ensure `server.js` is in root directory
- Ensure `styles.css` and `script.js` are in root directory

### Data resets after deploy
- Some platforms don't persist files between restarts
- Use Railway for persistent storage, or use a database

---

## 📈 For Scaling

If you need more features:
- Use **MongoDB** for database (MongoDB Atlas free tier)
- Add **authentication** (user accounts)
- Add **export to CSV/Excel**
- Add **monthly reports**

Contact me if you need help adding these!

---

**Choose Railway for easiest deployment!** 🚀
