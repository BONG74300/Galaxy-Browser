const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const app = express();

// Serve static frontend files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Initialize background Python proxy worker
const pyWorker = spawn('python3', ['core_proxy.py']);
pyWorker.stdout.on('data', (data) => console.log(`[Python Core]: ${data}`));
pyWorker.stderr.on('data', (data) => console.error(`[Python Error]: ${data}`));

app.get('/api/route', (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) return res.status(400).json({ error: "Target URL required" });
    res.json({ status: "SUCCESS", endpoint: `http://127.0.0.1:8080/proxy/${encodeURIComponent(targetUrl)}` });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Node.js Gateway active on port ${PORT}`);
});
