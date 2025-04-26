/* Base Theme */
body {
    font-family: 'Poppins', sans-serif;
    background: #0f172a;
    color: #f8fafc;
    margin: 0;
    padding: 0;
}

header {
    background: #1e293b;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
}

nav ul {
    list-style: none;
    display: flex;
    gap: 2rem;
    margin: 0;
    padding: 0;
}

nav a {
    color: #94a3b8;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s ease;
}

nav a:hover {
    color: #38bdf8;
}

.hero {
    padding: 4rem 2rem;
    background: linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%);
    text-align: center;
}

.feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    padding: 2rem;
}

.feature-card {
    background: #1e293b;
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
    transition: transform 0.3s ease;
}

.feature-card:hover {
    transform: translateY(-5px);
}

.feature-icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: #38bdf8;
}

.dashboard {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    padding: 2rem;
}

.chart-container {
    background: #1e293b;
    border-radius: 1rem;
    padding: 1.5rem;
}

.chatbot-container {
    background: #1e293b;
    border-radius: 1rem;
    padding: 1.5rem;
    height: 500px;
    display: flex;
    flex-direction: column;
}

.chat-history {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
    margin-bottom: 1rem;
    background: #0f172a;
    border-radius: 0.5rem;
}

.message {
    margin-bottom: 1rem;
    padding: 0.8rem;
    border-radius: 0.5rem;
    max-width: 80%;
}

.user-message {
    background: #38bdf8;
    margin-left: auto;
}

.bot-message {
    background: #334155;
}

.chat-input {
    display: flex;
    gap: 1rem;
}

.chat-input input {
    flex: 1;
    padding: 0.8rem;
    border: none;
    border-radius: 0.5rem;
    background: #0f172a;
    color: #f8fafc;
}

.chat-input button {
    background: #38bdf8;
    color: #0f172a;
    border: none;
    padding: 0.8rem 1.5rem;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: background 0.3s ease;
}

.chat-input button:hover {
    background: #1e3a8a;
}

.sustainability-panel {
    background: #1e293b;
    border-radius: 1rem;
    padding: 2rem;
    margin: 2rem;
}

.progress-tracker {
    display: flex;
    gap: 2rem;
    margin-top: 1.5rem;
}

.progress-item {
    flex: 1;
    text-align: center;
}

.progress-circle {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: conic-gradient(#38bdf8 0% 75%, #334155 75% 100%);
    margin: 0 auto 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
}

footer {
    background: #1e293b;
    padding: 2rem;
    text-align: center;
}