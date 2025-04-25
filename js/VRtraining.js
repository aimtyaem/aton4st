const http = require('http');
const fs = require('fs');
const path = require('path');
const open = require('open');

// Define TrainingHandler equivalent functionality
const requestHandler = (req, res) => {
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './demo.html';
    }

    const extname = path.extname(filePath);
    let contentType = 'text/html';
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.png':
            contentType = 'image/png';
            break;
    }

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(500);
                res.end('Server error');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
};

// Create and start server
const server = http.createServer(requestHandler);
const PORT = 8001;

server.listen(PORT, (err) => {
    if (err) {
        return console.error('Error starting server:', err);
    }
    
    console.log(`Serving VR training at http://localhost:${PORT}`);
    
    // Open browser tab
    open(`http://localhost:${PORT}/demo.html`).catch(err => {
        console.error('Error opening browser:', err);
    });
});