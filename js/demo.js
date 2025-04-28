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
    if (pathname === 'https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${startDate}&end_date=${endDate}&daily=temperature_2m_mean,precipitation_sum&timezone=auto' && method === 'POST') {
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
    

// Load 'scilib.json' at the top of the file
const scilibPath = path.resolve('./js/scilib.json');
let scilibData = {};

try {
    const scilibRaw = fs.readFileSync(scilibPath, 'utf-8');
    scilibData = JSON.parse(scilibRaw);
    console.log("Loaded scilib.json successfully.");
} catch (error) {
    console.error("Error loading scilib.json:", error);
}

// --- Modify the /api/climate-ai API Endpoint ---
else if (pathname === '/api/climate-ai' && method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
        try {
            const requestData = JSON.parse(body);
            const userQuery = requestData.query;
            const userChoice = requestData.choice;
            console.log("Received chatbot query:", userQuery);
            console.log("User's elective choice:", userChoice);

            // --- Mock AI Response Logic ---
            let botAnswer = "I am a climate expert. I received your query: '" + userQuery + "'";
            let electiveChoices = [];

            // Provide choices from scilib.json
            if (Object.keys(scilibData).length > 0) {
                electiveChoices = Object.keys(scilibData).map(key => ({
                    choice: key,
                    description: scilibData[key].description || `Description for ${key}`
                }));
            }

            // Customize response based on userQuery
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

            // Handle advanced choices based on the user's selection
            let advancedResponse = {};
            if (userChoice && scilibData[userChoice]) {
                advancedResponse = scilibData[userChoice];
                botAnswer += ` You selected "${userChoice}". Here is the advanced data: ${JSON.stringify(advancedResponse)}`;
            }

            // Prepare response
            const responseData = {
                answer: botAnswer,
                choices: electiveChoices // Provide elective choices to the user
            };

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
