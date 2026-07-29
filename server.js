const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const app = express();

// Serve your custom frontend files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Initialize the background Python proxy worker process
const pyWorker = spawn('python3', ['core_proxy.py']);
pyWorker.stdout.on('data', (data) => console.log(`[Python Core]: ${data}`));
pyWorker.stderr.on('data', (data) => console.error(`[Python Error]: ${data}`));

// API routing endpoint for proxy requests
app.get('/api/route', (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) return res.status(400).json({ error: "Target URL required" });
    
    // Forward the target to the local Python worker proxy pipeline
    res.json({ 
        status: "SUCCESS", 
        endpoint: `http://127.0.0.1:8080/proxy/${encodeURIComponent(targetUrl)}` 
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Gateway active on port ${PORT}`);
});
