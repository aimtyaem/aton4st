document.addEventListener('DOMContentLoaded', () => {
    // Chart.js Initialization for main dashboard
    const initClimateChart = (ctx) => {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['2010', '2015', '2020', '2025'],
                datasets: [{
                    label: 'Global Temperature Anomaly (°C)',
                    data: [0.72, 0.87, 1.02, 1.15],
                    borderColor: '#38bdf8',
                    tension: 0.4
                }]
            },
            options: getChartOptions()
        });
    };

    // Initialize main chart
    const mainCtx = document.getElementById('climateChart').getContext('2d');
    initClimateChart(mainCtx);

    // Shared chart configuration
    const getChartOptions = () => ({
        plugins: {
            legend: {
                labels: { color: '#f8fafc' }
            }
        },
        scales: {
            y: {
                ticks: { color: '#f8fafc' },
                grid: { color: '#334155' }
            },
            x: {
                ticks: { color: '#f8fafc' },
                grid: { color: '#334155' }
            }
        }
    });

    // Chatbot Logic
    async function sendMessage() {
        const input = document.getElementById('userInput');
        const message = input.value.trim();
        if (!message) return;

        const chatHistory = document.getElementById('chatHistory');
        
        // Add user message
        const userMsg = document.createElement('div');
        userMsg.className = 'message user-message';
        userMsg.textContent = message;
        chatHistory.appendChild(userMsg);

        input.value = '';
        chatHistory.scrollTop = chatHistory.scrollHeight;

        try {
            // Add loading indicator
            const loadingMsg = document.createElement('div');
            loadingMsg.className = 'message bot-message';
            loadingMsg.innerHTML = '<div class="loading-dots"><span>.</span><span>.</span><span>.</span></div>';
            chatHistory.appendChild(loadingMsg);
            chatHistory.scrollTop = chatHistory.scrollHeight;

            const botResponse = await getBotResponse(message);
            
            // Remove loading indicator
            chatHistory.removeChild(loadingMsg);

            if (botResponse === '__show_chart__') {
                // Create chat-embedded chart
                const canvas = document.createElement('canvas');
                canvas.style.maxWidth = '100%';
                canvas.height = 200;
                
                const container = document.createElement('div');
                container.className = 'message bot-message';
                container.appendChild(canvas);
                chatHistory.appendChild(container);

                // Initialize chart in chat
                new Chart(canvas.getContext('2d'), {
                    type: 'line',
                    data: {
                        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
                        datasets: [{
                            label: 'Monthly Temperature Variation',
                            data: [3.2, 3.8, 4.1, 5.0, 4.7],
                            borderColor: '#38bdf8',
                            tension: 0.4
                        }]
                    },
                    options: getChartOptions()
                });
            } else {
                // Regular text response
                const botMsg = document.createElement('div');
                botMsg.className = 'message bot-message';
                botMsg.textContent = botResponse;
                chatHistory.appendChild(botMsg);
            }
        } catch (error) {
            const errorMsg = document.createElement('div');
            errorMsg.className = 'message bot-message';
            errorMsg.textContent = "Sorry, I'm having trouble connecting. Please try again later.";
            chatHistory.appendChild(errorMsg);
        }
        
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    async function getBotResponse(query) {
        const API_URL = "https://api-inference.huggingface.co/models/ibm-granite/granite-3.3-8b-base";
        const API_KEY = "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";
        
        const headers = {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
        };

        const body = JSON.stringify({
            inputs: query,
            parameters: { max_new_tokens: 50 },
        });

        const response = await fetch(API_URL, {
            method: "POST",
            headers: headers,
            body: body,
        });

        if (!response.ok) throw new Error('API request failed');
        
        const data = await response.json();
        return data.generated_text || "I need more information to answer that. Could you please clarify?";
    }

    // Event listeners
    const userInput = document.getElementById('userInput');
    const sendButton = document.querySelector('.chat-input button');

    // Handle Enter key
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    // Handle button click
    sendButton.addEventListener('click', sendMessage);
});