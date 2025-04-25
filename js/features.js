// Stress Simulation
let stressLevel = 30;
let stressInterval;

function startStressSimulation() {
    stressInterval = setInterval(() => {
        if(stressLevel < 100) {
            stressLevel += Math.random() * 2;
            updateDashboard();
        }
    }, 2000);
}

function performBreathingExercise() {
    if(stressLevel > 20) {
        stressLevel -= 20;
        addChatMessage("Well done! Stress reduced through breathing exercise.");
        updateDashboard();
    }
}

function findOxygenTank() {
    addChatMessage("Follow the green lights to emergency oxygen supply!");
    // Would trigger visual effects in actual implementation
}

function updateDashboard() {
    // Update stress display
    document.getElementById('stressProgress').style.width = stressLevel + '%';
    document.getElementById('stressValue').textContent = Math.round(stressLevel) + '%';
    
    // Update heart rate
    document.getElementById('bpm').textContent = 
        Math.floor(80 + (stressLevel * 0.3)) + ' BPM';
    
    // Trigger chatbot warnings
    if(stressLevel > 75) {
        addChatMessage("Warning: Critical stress levels! Focus on breathing.");
    } else if(stressLevel > 50) {
        addChatMessage("Stress levels rising. Recommend calming exercises.");
    }
}

function addChatMessage(text) {
    const chatDiv = document.getElementById('chatMessages');
    chatDiv.innerHTML += `<p>> ${text}</p>`;
    chatDiv.scrollTop = chatDiv.scrollHeight;
}

// AR Breathing Exercise
function startARBreathing() {
    alert("AR Breathing Exercise Started! Follow the on-screen instructions.");
    addChatMessage("AR Breathing Exercise: Inhale 4s → Hold 6s → Exhale 8s");
}

// Chat System
const API_KEY = 'AIzaSyB-qg2CY7gGfowh5ITW5PwljgMMXlNKVHg';
let chatHistory = [];

async function sendMessage() {
    const input = document.getElementById('user-input');
    const message = input.value.trim();
    if (!message) return;

    // Add user message
    addMessage(message, 'user');
    input.value = '';

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `You are a stress expert or psychiatrist. Answer questions about the mood. Current question: ${message}`
                    }]
                }]
            })
        });

        const data = await response.json();
        const botResponse = data.candidates[0].content.parts[0].text;
        addMessage(botResponse, 'bot');
    } catch (error) {
        addMessage("Error connecting to the chat service", 'bot');
    }
}

function addMessage(text, sender) {
    const history = document.getElementById('chat-history');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    messageDiv.textContent = `${sender === 'user' ? 'You: ' : 'RA: '}${text}`;
    history.appendChild(messageDiv);
    history.scrollTop = history.scrollHeight;
}

// Start simulation when page loads
window.onload = startStressSimulation;