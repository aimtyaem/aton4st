document.addEventListener('DOMContentLoaded', () => {
    // Chart initialization function
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

    // Initialize main dashboard chart
    const mainChart = createChart(
        document.getElementById('climateChart').getContext('2d'),
        ['2010', '2015', '2020', '2025'],
        [0.72, 0.87, 1.02, 1.15],
        'Global Temperature Anomaly (°C)'
    );

    // Chart configuration
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

    // Chatbot functionality
    async function sendMessage() {
        const input = document.getElementById('userInput');
        const message = input.value.trim();
        if (!message) return;

        const chatHistory = document.getElementById('chatHistory');
        
        // Add user message
        chatHistory.innerHTML += `
            <div class="message user-message">
                ${sanitizeHTML(message)}
            </div>
        `;

        input.value = '';
        chatHistory.scrollTop = chatHistory.scrollHeight;

        try {
            // Add loading indicator
            const loadingId = `loading-${Date.now()}`;
            chatHistory.innerHTML += `
                <div class="message bot-message" id="${loadingId}">
                    <div class="loading-dots">
                        <span>.</span><span>.</span><span>.</span>
                    </div>
                </div>
            `;
            chatHistory.scrollTop = chatHistory.scrollHeight;

            // Get and process response
            const response = await getBotResponse(message);
            document.getElementById(loadingId).remove();

            if (response.type === 'chart') {
                chatHistory.innerHTML += `
                    <div class="message bot-message chart-container">
                        <canvas data-labels="${response.labels}" 
                                data-data="${response.data}" 
                                data-title="${response.title}"></canvas>
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
            } else {
                chatHistory.innerHTML += `
                    <div class="message bot-message">
                        ${sanitizeHTML(response.text)}
                    </div>
                `;
            }
        } catch (error) {
            console.error('Chat error:', error);
            chatHistory.innerHTML += `
                <div class="message bot-message error">
                    Error: ${sanitizeHTML(error.message)}
                </div>
            `;
        }

        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    // API communication handler
    async function getBotResponse(query) {
        // Simple command detection
        if (query.toLowerCase().includes('temperature')) {
            return {
                type: 'chart',
                labels: '2010,2015,2020,2025',
                data: '0.72,0.87,1.02,1.15',
                title: 'Global Temperature Trend'
            };
        }

        // Fallback to API
        try {
            const response = await fetch('https://api-inference.huggingface.co/models/ibm-granite/granite-3.3-2b-base', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer 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`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    inputs: query,
                    parameters: { max_new_tokens: 50 }
                })
            });

            if (!response.ok) throw new Error(`API error: ${response.status}`);
            
            const data = await response.json();
            return {
                type: 'text',
                text: data.generated_text || "I need more information to answer that."
            };
        } catch (error) {
            return {
                type: 'text',
                text: "Sorry, I'm having trouble connecting. Please try again later."
            };
        }
    }

    // Security helper
    const sanitizeHTML = (str) => {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    };

    // Event listeners
    document.getElementById('userInput').addEventListener('keypress', e => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    document.getElementById('sendButton').addEventListener('click', sendMessage);
});
