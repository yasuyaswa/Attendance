const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'attendance.json');

// Serve static files
function serveStatic(filePath, res) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
      return;
    }
    
    // Determine content type
    const ext = path.extname(filePath).toLowerCase();
    let contentType = 'text/plain';
    if (ext === '.html') contentType = 'text/html; charset=utf-8';
    else if (ext === '.css') contentType = 'text/css; charset=utf-8';
    else if (ext === '.js') contentType = 'application/javascript; charset=utf-8';
    else if (ext === '.json') contentType = 'application/json; charset=utf-8';
    
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

// Create server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Serve static files (HTML, CSS, JS)
  if (pathname === '/' || pathname === '/attendance.html') {
    const filePath = path.join(__dirname, 'attendance.html');
    serveStatic(filePath, res);
    return;
  }

  if (pathname === '/styles.css') {
    const filePath = path.join(__dirname, 'styles.css');
    serveStatic(filePath, res);
    return;
  }

  if (pathname === '/script.js' || pathname === '/supabase-config.js') {
    // serve main script or Supabase configuration
    const filePath = path.join(__dirname, pathname.slice(1));
    serveStatic(filePath, res);
    return;
  }

  if (pathname === '/README.md') {
    const filePath = path.join(__dirname, 'README.md');
    serveStatic(filePath, res);
    return;
  }

  // Generic static JS fallback: serve any .js file in the root
  if (pathname.endsWith('.js')) {
    const filePath = path.join(__dirname, pathname);
    serveStatic(filePath, res);
    return;
  }

  // API: GET /api/attendance - fetch data
  if (pathname === '/api/attendance' && req.method === 'GET') {
    fs.readFile(DATA_FILE, 'utf-8', (err, data) => {
      if (err) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ data: {} }));
        return;
      }
      try {
        const parsed = JSON.parse(data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ data: parsed }));
      } catch {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ data: {} }));
      }
    });
    return;
  }

  // API: POST /api/attendance - save data
  if (pathname === '/api/attendance' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const { date, status } = payload;

        // Read current data
        fs.readFile(DATA_FILE, 'utf-8', (err, data) => {
          let attendance = {};
          if (!err && data) {
            try {
              attendance = JSON.parse(data);
            } catch {}
          }

          // Update or delete entry
          if (status === null || status === undefined) {
            delete attendance[date];
          } else {
            attendance[date] = status;
          }

          // Save back to file
          fs.writeFile(DATA_FILE, JSON.stringify(attendance, null, 2), (writeErr) => {
            if (writeErr) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Failed to save' }));
              return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ ok: true }));
          });
        });
      } catch {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid request' }));
      }
    });
    return;
  }

  // 404
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

server.listen(PORT, () => {
  console.log(`🎯 Attendance Calendar running at http://localhost:${PORT}`);
  console.log(`📝 Data saved to: ${DATA_FILE}`);
});
