// demo.js (Server - UPDATED)
const http = require('http');
const fs = require('fs');
const path = require('path');
const open = require('open');
const url = require('url');

// --- Analysis Logic (Lives on the server) ---
class NeuralNetwork { /* ... (same as before) ... */
    predict(data) { console.log("NeuralNetwork: Predicting temperature trend (server-side)..."); const validData = data?.filter(d => d !== null && d !== undefined); if (validData && validData.length > 0) { return "Simulated rising temperature trend (from server)"; } else { return "No valid temperature data points (from server)"; } }
}
class RegressionModel { /* ... (same as before) ... */
    calculateCorrelation(co2Data, tempData) { console.log("RegressionModel: Calculating CO2-temperature correlation (server-side)..."); if (co2Data && tempData && co2Data.length > 0 && co2Data.length === tempData.length) { return "Simulated strong positive correlation (from server)"; } else { return "Insufficient/mismatched data for correlation (from server)"; } }
}
class TimeSeriesAnalyzer { /* ... (same as before) ... */
    calculateSlope(data) { console.log("TimeSeriesAnalyzer: Calculating sea level slope (server-side)..."); const validData = data?.filter(d => d !== null && d !== undefined); if (validData && validData.length > 0) { return "Simulated rising sea level trend (from server)"; } else { return "No valid sea level data points (from server)"; } }
}
class ClimateAnalyzer { /* ... (same as before) ... */
     constructor() { this.models = { temperature: new NeuralNetwork(), co2: new RegressionModel(), seaLevel: new TimeSeriesAnalyzer() }; console.log("ClimateAnalyzer initialized on server."); }
     analyzeDataset(dataset) { console.log("ClimateAnalyzer: Analyzing dataset (server-side)..."); const results = {}; if (!dataset || dataset.length === 0) { console.log("ClimateAnalyzer: Dataset is empty on server."); results.temperatureTrend = "No data provided"; results.co2Impact = "No data provided"; results.seaLevel = "No data provided"; return results; } const tempData = dataset.map(d => d?.temp ?? null); const co2Data = dataset.map(d => d?.co2 ?? null); const seaLevelData = dataset.map(d => d?.seaLevel ?? null); results.temperatureTrend = this.models.temperature.predict(tempData); results.co2Impact = this.models.co2.calculateCorrelation(co2Data, tempData); results.seaLevel = this.models.seaLevel.calculateSlope(seaLevelData); console.log("ClimateAnalyzer: Server-side analysis complete."); return results; }
}
const analyzer = new ClimateAnalyzer(); // Instantiate analyzer on server

// --- Server Request Handling ---
const requestHandler = (req, res) => {
    const parsedUrl = url.parse(req.url);
    const pathname = parsedUrl.pathname;
    const method = req.method;
    console.log(`Request received: ${method} ${pathname}`);

    // API Endpoint: /api/analyze
    if (pathname === '/api/analyze' && method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const dataset = JSON.parse(body);
                console.log("Received dataset for analysis:", dataset);
                const analysisResults = analyzer.analyzeDataset(dataset); // Use server-side analyzer
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(analysisResults));
                console.log("Sent analysis results to client.");
            } catch (error) {
                console.error("Error processing /api/analyze request:", error);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON data for analysis' }));
            }
        });
    }
    // API Endpoint: /api/climate-ai (NEW for chatbot)
    else if (pathname === '/api/climate-ai' && method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
             try {
                const requestData = JSON.parse(body);
                const userQuery = requestData.query;
                console.log("Received chatbot query:", userQuery);

                // --- Mock AI Response Logic ---
                let botAnswer = "I am a simple climate AI assistant. I received your query: '" + userQuery + "'";
                if (userQuery.toLowerCase().includes("temperature")) {
                    botAnswer = "Based on current trends, global temperatures are rising. Specific data can be found in recent climate reports.";
                } else if (userQuery.toLowerCase().includes("co2") || userQuery.toLowerCase().includes("carbon")) {
                     botAnswer = "Atmospheric CO2 levels are currently around 420ppm, significantly higher than pre-industrial levels and a major driver of warming.";
                } else if (userQuery.toLowerCase().includes("sea level")) {
                    botAnswer = "Sea levels are rising due to thermal expansion of ocean water and melting ice sheets. Projections vary, but the trend is accelerating.";
                } else if (userQuery.toLowerCase().includes("amazon")) {
                    botAnswer = "The Amazon rainforest is experiencing significant deforestation, impacting biodiversity and the global carbon cycle.";
                } else if (userQuery.toLowerCase().includes("arctic")) {
                     botAnswer = "The Arctic is warming faster than the global average, leading to rapid loss of sea ice and permafrost thaw.";
                }
                // --- End Mock Logic ---

                const responseData = { answer: botAnswer };
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(responseData));
                console.log("Sent chatbot response to client.");

            } catch (error) {
                console.error("Error processing /api/climate-ai request:", error);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON data for chatbot query' }));
            }
        });
    }
    // Static File Serving
    else {
        // Serve demo.html as the default page now
        let filePath = '.' + pathname;
        if (filePath === './' || filePath === './index') { // Still allow / or /index for flexibility if needed
             filePath = './demo.html';
        } else if (pathname === '/demo') { // Allow access via /demo
             filePath = './demo.html';
        }

        // Security: Prevent accessing files outside the current directory
        const resolvedPath = path.resolve(filePath);
        if (!resolvedPath.startsWith(path.resolve('.'))) {
             console.error(`Attempted access outside root directory: ${filePath}`);
             res.writeHead(403); res.end('Access denied'); return;
        }

        const extname = path.extname(filePath);
        let contentType = 'text/html';
        // Add more MIME types as needed
        switch (extname) {
            case '.js': contentType = 'text/javascript'; break;
            case '.css': contentType = 'text/css'; break;
            case '.png': contentType = 'image/png'; break;
            case '.jpg': case '.jpeg': contentType = 'image/jpeg'; break; // Added jpeg
            case '.gif': contentType = 'image/gif'; break; // Added gif
            case '.json': contentType = 'application/json'; break;
            // Add other common types if necessary (svg, woff2, etc.)
        }

        fs.readFile(filePath, (err, content) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    console.error(`File not found: ${filePath}`);
                    res.writeHead(404); res.end('File not found');
                } else {
                    console.error(`Server error reading file: ${filePath}`, err);
                    res.writeHead(500); res.end('Server error');
                }
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content); // No need for 'utf-8' for binary files like images
                // console.log(`Served static file: ${filePath}`); // Keep console less noisy
            }
        });
    }
};

// --- Create and Start Server ---
const server = http.createServer(requestHandler);
const PORT = 8001;
server.listen(PORT, (err) => {
    if (err) { return console.error('Error starting server:', err); }
    const serverUrl = `http://localhost:${PORT}`;
    console.log(`Server running at ${serverUrl}`);
    console.log(`Serving API at POST ${serverUrl}/api/analyze`);
    console.log(`Serving API at POST ${serverUrl}/api/climate-ai`); // Log new endpoint
    // Open the default demo page
    open(`${serverUrl}/demo.html`).catch(err => {
        console.error('Error opening browser:', err);
    });
});
