const http = require('http');
const fs = require('fs');
const path = require('path');

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase. Fails gracefully if env keys are missing to prevent crashing.
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

const server = http.createServer(async (req, res) => {
  // CORS headers for API
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Redirect for Resume stored in Supabase Bucket
  if (req.url === '/api/resume' && req.method === 'GET') {
    if (!supabase) {
      res.writeHead(302, { 'Location': '/Tushar2.pdf' }); // fallback to local
      return res.end();
    }
    const { data } = supabase.storage.from('portfolio_assets').getPublicUrl('Tushar2.pdf');
    if (data && data.publicUrl) {
      res.writeHead(302, { 'Location': data.publicUrl });
      res.end();
    } else {
      res.writeHead(404);
      res.end('Resume not found in Supabase Storage');
    }
    return;
  }

  // Visitor counter API - GET
  if (req.url === '/api/visitors' && req.method === 'GET') {
    if (!supabase) return res.writeHead(200), res.end(JSON.stringify({ count: 0 }));
    try {
      const { data, error } = await supabase.from('metrics').select('count').eq('id', 1).single();
      if (error) throw error;
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ count: data.count }));
    } catch (err) {
      res.writeHead(500); res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // Visitor counter API - POST (Increment)
  if (req.url === '/api/visitors' && req.method === 'POST') {
    if (!supabase) return res.writeHead(200), res.end(JSON.stringify({ count: 1 }));
    try {
      const { data: curr, error: fetchErr } = await supabase.from('metrics').select('count').eq('id', 1).single();
      if (fetchErr) throw fetchErr;
      const newCount = curr.count + 1;
      const { error: updateErr } = await supabase.from('metrics').update({ count: newCount }).eq('id', 1);
      if (updateErr) throw updateErr;
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ count: newCount }));
    } catch (err) {
      res.writeHead(500); res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // Static file serving
  let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
  const ext = path.extname(filePath);
  const types = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.css': 'text/css',
    '.pdf': 'application/pdf',
    '.woff2': 'font/woff2',
    '.woff': 'font/woff'
  };

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, {
      'Content-Type': types[ext] || 'text/plain'
    });
    res.end(data);
  });
});

server.listen(3000, () => {
  console.log('Portfolio running at http://localhost:3000');
});
