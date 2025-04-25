// demo.js (Server - No changes needed from the previous version)
const http = require('http');
const fs = require('fs');
const path = require('path');
const open = require('open');
const url = require('url');

// --- Analysis Logic (Lives on the server) ---
class NeuralNetwork { /* ... (same as before) ... */ 
    predict(data) {
        console.log("NeuralNetwork: Predicting temperature trend (server-side)...");
        const validData = data?.filter(d => d !== null && d !== undefined);
        if (validData && validData.length > 0) {
            return "Simulated rising temperature trend (from server)";
        } else {
            return "No valid temperature data points (from server)";
        }
    }
}
class RegressionModel { /* ... (same as before) ... */ 
    calculateCorrelation(co2Data, tempData) {
        console.log("RegressionModel: Calculating CO2-temperature correlation (server-side)...");
        if (co2Data && tempData && co2Data.length > 0 && co2Data.length === tempData.length) {
            return "Simulated strong positive correlation (from server)";
        } else {
            return "Insufficient/mismatched data for correlation (from server)";
        }
    }
}
class TimeSeriesAnalyzer { /* ... (same as before) ... */ 
    calculateSlope(data) {
        console.log("TimeSeriesAnalyzer: Calculating sea level slope (server-side)...");
         const validData = data?.filter(d => d !== null && d !== undefined);
        if (validData && validData.length > 0) {
            return "Simulated rising sea level trend (from server)";
        } else {
            return "No valid sea level data points (from server)";
        }
    }
}
class ClimateAnalyzer { /* ... (same as before) ... */ 
     constructor() {
        this.models = {
            temperature: new NeuralNetwork(),
            co2: new RegressionModel(),
            seaLevel: new TimeSeriesAnalyzer()
        };
        console.log("ClimateAnalyzer initialized on server.");
    }
    analyzeDataset(dataset) {
        console.log("ClimateAnalyzer: Analyzing dataset (server-side)...");
        const results = {};
        if (!dataset || dataset.length === 0) {
            console.log("ClimateAnalyzer: Dataset is empty on server.");
             results.temperatureTrend = "No data provided";
             results.co2Impact = "No data provided";
             results.seaLevel = "No data provided";
            return results;
        }
        const tempData = dataset.map(d => d?.temp ?? null);
        const co2Data = dataset.map(d => d?.co2 ?? null);
        const seaLevelData = dataset.map(d => d?.seaLevel ?? null);
        results.temperatureTrend = this.models.temperature.predict(tempData);
        results.co2Impact = this.models.co2.calculateCorrelation(co2Data, tempData);
        results.seaLevel = this.models.seaLevel.calculateSlope(seaLevelData);
        console.log("ClimateAnalyzer: Server-side analysis complete.");
        return results;
    }
}
const analyzer = new ClimateAnalyzer();

// --- Server Request Handling ---
const requestHandler = (req, res) => {
    const parsedUrl = url.parse(req.url);
    const pathname = parsedUrl.pathname;
    const method = req.method;
    console.log(`Request received: ${method} ${pathname}`);

    // API Endpoint: /api/analyze
    if (pathname === '/api/analyze' && method === 'POST') {
        // ... (API handling code - same as before) ...
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const dataset = JSON.parse(body);
                console.log("Received dataset on server:", dataset);
                const analysisResults = analyzer.analyzeDataset(dataset);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(analysisResults));
                console.log("Sent analysis results to client.");
            } catch (error) {
                console.error("Error processing API request:", error);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON data received' }));
            }
        });
    }
    // Static File Serving
    else {
        let filePath = '.' + pathname;
        if (filePath === './' || filePath === './index') { // Allow access via / or /index
             filePath = './index.html';
        }
        // Security: Prevent accessing files outside the current directory
        const resolvedPath = path.resolve(filePath);
        if (!resolvedPath.startsWith(path.resolve('.'))) {
             console.error(`Attempted access outside root directory: ${filePath}`);
             res.writeHead(403); // Forbidden
             res.end('Access denied');
             return;
         }

        const extname = path.extname(filePath);
        let contentType = 'text/html';
        // Add more MIME types as needed
        switch (extname) {
            case '.js': contentType = 'text/javascript'; break;
            case '.css': contentType = 'text/css'; break;
            case '.png': contentType = 'image/png'; break;
            case '.jpg': contentType = 'image/jpeg'; break;
            case '.json': contentType = 'application/json'; break;
        }

        fs.readFile(filePath, (err, content) => {
            // ... (Static file serving logic - same as before) ...
            if (err) {
                if (err.code === 'ENOENT') {
                    console.error(`File not found: ${filePath}`);
                    res.writeHead(404);
                    res.end('File not found');
                } else {
                    console.error(`Server error reading file: ${filePath}`, err);
                    res.writeHead(500);
                    res.end('Server error');
                }
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
                // console.log(`Served static file: ${filePath}`); // Reduce console noise
            }
        });
    }
};

// --- Create and Start Server ---
const server = http.createServer(requestHandler);
const PORT = 8001;
server.listen(PORT, (err) => {
    // ... (Server start logic - same as before) ...
    if (err) {
        return console.error('Error starting server:', err);
    }
    const serverUrl = `http://localhost:${PORT}`;
    console.log(`Server running at ${serverUrl}`);
    console.log(`Serving analysis API at POST ${serverUrl}/api/analyze`);
    open(`${serverUrl}/index.html`).catch(err => {
        console.error('Error opening browser:', err);
    });
});

