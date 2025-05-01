// If running in a Node.js environment, uncomment the following line:
// const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const API_KEY = "KBgTbj8wRC1LZ1LOZiGiesd_3qjYseSaz0JBlreIYC5c";

function getToken(errorCallback, loadCallback) {
	const req = new XMLHttpRequest();
	req.addEventListener("load", loadCallback);
	req.addEventListener("error", errorCallback);
	req.open("POST", "https://iam.cloud.ibm.com/identity/token");
	req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	req.setRequestHeader("Accept", "application/json");
	req.send("grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=" + API_KEY);
}

function apiPost(scoring_url, token, payload, loadCallback, errorCallback){
	const oReq = new XMLHttpRequest();
	oReq.addEventListener("load", loadCallback);
	oReq.addEventListener("error", errorCallback);
	oReq.open("POST", scoring_url);
	oReq.setRequestHeader("Accept", "application/json");
	oReq.setRequestHeader("Authorization", "Bearer " + token);
	oReq.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	oReq.send(payload);
}

// UI features (menu toggle, chart, etc.)
document.querySelector('.menu-toggle').addEventListener('click', () => {
    document.querySelector('nav').classList.toggle('active');
});

document.addEventListener('DOMContentLoaded', () => {
    const createChart = (ctx, labels, data, label) => {
        return new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: label,
                    data: data,
                    borderColor: '#38bdf8',
                    tension: 0.4
                }]
            },
            options: getChartOptions()
        });
    };

    const mainChart = createChart(
        document.getElementById('climateChart').getContext('2d'),
        ['2010', '2015', '2020', '2025'],
        [0.72, 0.87, 1.02, 1.15],
        'Global Temperature Anomaly (°C)'
    );

    const getChartOptions = () => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: { color: '#f8fafc' }
            }
        },
        scales: {
            y: {
                beginAtZero: false,
                ticks: { color: '#f8fafc' },
                grid: { color: '#334155' }
            },
            x: {
                ticks: { color: '#f8fafc' },
                grid: { color: '#334155' }
            }
        }
    });

    // Chat Feature
    let chatToken = null; // Store IBM token here after retrieval

    function getIBMBearerToken(callback) {
        getToken(
            (err) => {
                console.error("Token error:", err);
                callback(null);
            },
            function () {
                let tokenResponse;
                try {
                    tokenResponse = JSON.parse(this.responseText);
                    callback(tokenResponse.access_token);
                } catch (ex) {
                    console.error("Token parse error:", ex);
                    callback(null);
                }
            }
        );
    }

    function sanitizeHTML(str) {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    }

    function addMessageToHistory(message, isUser, isError) {
        const chatHistory = document.getElementById('chatHistory');
        chatHistory.innerHTML += `
            <div class="message ${isUser ? 'user-message' : (isError ? 'bot-message error' : 'bot-message')}">
                ${sanitizeHTML(message)}
            </div>
        `;
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    function addLoadingMessage() {
        const chatHistory = document.getElementById('chatHistory');
        const loadingId = `loading-${Date.now()}`;
        chatHistory.innerHTML += `
            <div class="message bot-message" id="${loadingId}">
                <div class="loading-dots">
                    <span>.</span><span>.</span><span>.</span>
                </div>
            </div>
        `;
        chatHistory.scrollTop = chatHistory.scrollHeight;
        return loadingId;
    }

    function removeLoadingMessage(loadingId) {
        const elem = document.getElementById(loadingId);
        if (elem) elem.remove();
    }

    function sendMessage() {
        const input = document.getElementById('userInput');
        const message = input.value.trim();
        if (!message) return;

        addMessageToHistory(message, true, false);
        input.value = '';

        const loadingId = addLoadingMessage();

        // Chart demo shortcut
        if (message.toLowerCase().includes('temperature')) {
            removeLoadingMessage(loadingId);
            const chatHistory = document.getElementById('chatHistory');
            chatHistory.innerHTML += `
                <div class="message bot-message chart-container">
                    <canvas data-labels="2010,2015,2020,2025" data-data="0.72,0.87,1.02,1.15" data-title="Global Temperature Trend"></canvas>
                </div>
            `;
            // Initialize new charts
            document.querySelectorAll('.chart-container canvas').forEach(canvas => {
                new Chart(canvas.getContext('2d'), {
                    type: 'line',
                    data: {
                        labels: canvas.dataset.labels.split(','),
                        datasets: [{
                            label: canvas.dataset.title,
                            data: canvas.dataset.data.split(',').map(Number),
                            borderColor: '#38bdf8',
                            tension: 0.4
                        }]
                    },
                    options: getChartOptions()
                });
            });
            return;
        }

        // Ensure we have a token before sending to IBM
        function doChat(token) {
            if (!token) {
                removeLoadingMessage(loadingId);
                addMessageToHistory("Sorry, I'm having trouble connecting (no token).", false, true);
                return;
            }
            const scoring_url = "https://eu-de.ml.cloud.ibm.com/ml/v4/deployments/de940c69-fa13-448b-84bc-95cdb5f5af86/ai_service_stream?version=2021-05-01";
            const payload = JSON.stringify({ "messages": [{ "content": message, "role": "user" }] });

            apiPost(scoring_url, token, payload,
                function () {
                    removeLoadingMessage(loadingId);
                    let parsedPostResponse;
                    try {
                        parsedPostResponse = JSON.parse(this.responseText);
                        let botMessage = "";
                        if (parsedPostResponse && parsedPostResponse.results && parsedPostResponse.results.length > 0) {
                            botMessage = parsedPostResponse.results[0].generated_text || "I need more information to answer that.";
                        } else {
                            botMessage = "I need more information to answer that.";
                        }
                        addMessageToHistory(botMessage, false, false);
                    } catch (ex) {
                        addMessageToHistory("Error parsing AI response.", false, true);
                    }
                },
                function (error) {
                    removeLoadingMessage(loadingId);
                    addMessageToHistory("Sorry, I'm having trouble connecting. Please try again later.", false, true);
                }
            );
        }

        if (chatToken) {
            doChat(chatToken);
        } else {
            getIBMBearerToken(function(token) {
                chatToken = token;
                doChat(token);
            });
        }
    }

    document.getElementById('userInput').addEventListener('keypress', e => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    document.getElementById('sendButton').addEventListener('click', sendMessage);

});