document.addEventListener('DOMContentLoaded', function() {
            console.log("DOM Fully Loaded - Initializing Scripts");
            const API_KEY = 'AIzaSyB-qg2CY7gGfowh5ITW5PwljgMMXlNKVHg'; // Consider moving to server-side

            // ---------- Climate Analysis ----------
            async function fetchClimateData(lat=40.71, lon=-74.01, startDate='2020-01-01', endDate='2023-01-01') {
                const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${startDate}&end_date=${endDate}&daily=temperature_2m_mean,precipitation_sum&timezone=auto`;
                
                try {
                    const response = await fetch(url);
                    if (!response.ok) throw new Error(`HTTP error! ${response.status}`);
                    return await response.json();
                } catch (error) {
                    console.error("Climate data fetch failed:", error);
                    return null;
                }
            }

            window.runClimateAnalysis = async function() {
                const resultsDisplay = document.getElementById('analysis-results');
                resultsDisplay.textContent = 'Analyzing...';

                try {
                    const climateData = await fetchClimateData();
                    if (!climateData) throw new Error("No climate data received");

                    const analysisData = climateData.daily.time.map((date, index) => ({
                        date,
                        temperature: climateData.daily.temperature_2m_mean[index],
                        precipitation: climateData.daily.precipitation_sum[index]
                    }));

                    resultsDisplay.textContent = JSON.stringify(analysisData, null, 2);
                } catch (error) {
                    resultsDisplay.textContent = `Error: ${error.message}`;
                }
            }

            // ---------- 3D Globe Implementation ----------
            function initializeGlobe() {
                const globeCanvas = document.getElementById('climateGlobe');
                const container = document.getElementById('globe-scene');
                
                if (!globeCanvas || !container) return;

                // Scene setup
                const scene = new THREE.Scene();
                const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
                const renderer = new THREE.WebGLRenderer({ 
                    canvas: globeCanvas,
                    antialias: true,
                    alpha: true
                });

                // Handle texture errors
                const handleTextureError = (error) => {
                    console.error('Texture loading error:', error);
                    material.map = new THREE.TextureLoader().load('img/fallback-texture.jpg');
                };

                // Globe material
                const textureLoader = new THREE.TextureLoader();
                const material = new THREE.MeshPhongMaterial({
                    map: textureLoader.load('img/earth-texture.jpg', undefined, handleTextureError),
                    specularMap: textureLoader.load('img/earth-specular.jpg', undefined, handleTextureError),
                    specular: new THREE.Color('grey')
                });

                // Create sphere
                const earth = new THREE.Mesh(
                    new THREE.SphereGeometry(4, 32, 32),
                    material
                );
                scene.add(earth);

                // Lighting
                scene.add(new THREE.AmbientLight(0xffffff, 0.6));
                const pointLight = new THREE.PointLight(0xffffff, 0.9);
                pointLight.position.set(15, 20, 15);
                scene.add(pointLight);

                // Animation
                camera.position.z = 10;
                function animate() {
                    requestAnimationFrame(animate);
                    earth.rotation.y += 0.003;
                    renderer.render(scene, camera);
                }
                animate();

                // Handle window resize
                window.addEventListener('resize', () => {
                    camera.aspect = container.clientWidth / container.clientHeight;
                    camera.updateProjectionMatrix();
                    renderer.setSize(container.clientWidth, container.clientHeight);
                });
            }
            initializeGlobe();

            // ---------- Climate Chart ----------
            async function initializeChart() {
                const ctx = document.getElementById('climateChart')?.getContext('2d');
                if (!ctx) return;

                try {
                    const data = await fetchClimateData();
                    if (!data) throw new Error('No chart data available');

                    new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: data.daily.time.map(date => date.substring(0, 7)), // Show YYYY-MM
                            datasets: [{
                                label: 'Temperature (°C)',
                                data: data.daily.temperature_2m_mean,
                                borderColor: '#ff6b6b',
                                fill: true,
                                tension: 0.1
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: { labels: { color: '#333' } },
                                tooltip: { mode: 'index' }
                            },
                            scales: {
                                x: { ticks: { maxTicksLimit: 10 } }
                            }
                        }
                    });
                } catch (error) {
                    ctx.canvas.parentElement.innerHTML = `<p>Chart Error: ${error.message}</p>`;
                }
            }
            initializeChart();

            // ---------- Enhanced Chat System ----------
            window.sendClimateQuery = async function() {
                const input = document.getElementById('climateQuery');
                const chat = document.getElementById('climateChat');
                const message = input.value.trim();
                if (!message) return;

                // Disable input during processing
                input.disabled = true;
                
                // Add user message
                const userMsg = document.createElement('div');
                userMsg.className = 'message user';
                userMsg.textContent = message;
                chat.appendChild(userMsg);

                // Add thinking indicator
                const thinkingMsg = document.createElement('div');
                thinkingMsg.className = 'message bot typing';
                thinkingMsg.textContent = 'Analyzing...';
                chat.appendChild(thinkingMsg);
                chat.scrollTop = chat.scrollHeight;

                try {
                    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-04-17:generateContent?key=${API_KEY}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [{
                                parts: [{
                                    text: `As a climate science expert, answer this question: ${message}. 
                                           Use verified data sources and maintain a professional tone.`
                                }]
                            }]
                        })
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error?.message || 'API request failed');
                    }

                    const data = await response.json();
                    const botResponse = data.candidates[0].content.parts[0].text;
                    
                    thinkingMsg.textContent = botResponse;
                    thinkingMsg.classList.remove('typing');
                } catch (error) {
                    thinkingMsg.textContent = `Error: ${error.message}`;
                    thinkingMsg.classList.remove('typing');
                    console.error("Chat error:", error);
                } finally {
                    input.disabled = false;
                    input.focus();
                    chat.scrollTop = chat.scrollHeight;
                }
            }
        });
        // Chatbot Logic
        async function sendClimateQuery() {
            const input = document.getElementById('climateQuery');
            const message = input.value.trim();
            if (!message) return;

            const chat = document.getElementById('climateChat');

            // Add user message
            const userMsg = document.createElement('div');
            userMsg.className = 'message user';
            userMsg.textContent = message;
            chat.appendChild(userMsg);

            // Get bot response
            const response = await fetch('/api/climate-ai', {
                method: 'POST',
                body: JSON.stringify({ query: message })
            });
            const data = await response.json();

            // Add bot message
            const botMsg = document.createElement('div');
            botMsg.className = 'message bot';
            //Sanitize the bot output
            const botText = document.createElement('p');
            botText.textContent = data.answer;
            botMsg.appendChild(botText);

            chat.appendChild(botMsg);

            input.value = '';
            chat.scrollTop = chat.scrollHeight;
        }
    