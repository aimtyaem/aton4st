// Integration for hierarchical elective choices from scilib.json as prompt injection for demo.js chatbot

// --- 1. Utility to fetch and parse scilib.json ---
async function fetchScilib() {
    try {
        const response = await fetch('js/scilib.json');
        if (!response.ok) throw new Error("Failed to load scilib.json");
        return await response.json();
    } catch (e) {
        console.error("Error fetching scilib.json:", e);
        return null;
    }
}

// --- 2. UI: Render hierarchical choices as clickable menus ---
function renderElectiveChoices(categories, container, onElect) {
    container.innerHTML = '';
    categories.forEach(cat => {
        const catDiv = document.createElement('div');
        catDiv.className = 'scilib-category';
        catDiv.innerHTML = `<strong>${cat.label}</strong>`;
        catDiv.style.cursor = 'pointer';

        const datasetsDiv = document.createElement('div');
        datasetsDiv.className = 'scilib-datasets';
        datasetsDiv.style.display = 'none';

        cat.datasets.forEach(ds => {
            const dsDiv = document.createElement('div');
            dsDiv.className = 'scilib-dataset';
            dsDiv.textContent = ds.name;
            dsDiv.title = ds.description || '';
            dsDiv.style.marginLeft = '1em';
            dsDiv.style.cursor = 'pointer';

            // Advanced options (tutorials, publications, tools, etc.)
            const advancedDiv = document.createElement('div');
            advancedDiv.className = 'scilib-advanced';
            advancedDiv.style.display = 'none';
            advancedDiv.style.marginLeft = '2em';

            // Tutorials
            if (ds.tutorials && ds.tutorials.length) {
                const tutLabel = document.createElement('div');
                tutLabel.textContent = 'Tutorials:';
                advancedDiv.appendChild(tutLabel);
                ds.tutorials.forEach(tut => {
                    const link = document.createElement('a');
                    link.href = tut.url;
                    link.target = '_blank';
                    link.textContent = tut.title;
                    link.style.display = 'block';
                    advancedDiv.appendChild(link);
                });
            }
            // Publications
            if (ds.publications && ds.publications.length) {
                const pubLabel = document.createElement('div');
                pubLabel.textContent = 'Publications:';
                advancedDiv.appendChild(pubLabel);
                ds.publications.forEach(pub => {
                    const link = document.createElement('a');
                    link.href = pub.url;
                    link.target = '_blank';
                    link.textContent = pub.title;
                    link.style.display = 'block';
                    advancedDiv.appendChild(link);
                });
            }
            // Tools
            if (ds.tools && ds.tools.length) {
                const toolLabel = document.createElement('div');
                toolLabel.textContent = 'Tools:';
                advancedDiv.appendChild(toolLabel);
                ds.tools.forEach(tool => {
                    const link = document.createElement('a');
                    link.href = tool.url;
                    link.target = '_blank';
                    link.textContent = tool.title;
                    link.style.display = 'block';
                    advancedDiv.appendChild(link);
                });
            }
            // Documentation
            if (ds.documentation) {
                const docLabel = document.createElement('div');
                docLabel.textContent = 'Documentation:';
                advancedDiv.appendChild(docLabel);
                const docLink = document.createElement('a');
                docLink.href = ds.documentation;
                docLink.target = '_blank';
                docLink.textContent = ds.documentation;
                advancedDiv.appendChild(docLink);
            }

            dsDiv.addEventListener('click', function(e) {
                e.stopPropagation();
                // Toggle advanced options
                advancedDiv.style.display = advancedDiv.style.display === 'none' ? 'block' : 'none';
                // Inject prompt and close menu if elected
                if (onElect) onElect(cat, ds);
            });

            dsDiv.appendChild(advancedDiv);
            datasetsDiv.appendChild(dsDiv);
        });

        catDiv.addEventListener('click', function() {
            // Toggle datasets
            datasetsDiv.style.display = datasetsDiv.style.display === 'none' ? 'block' : 'none';
        });

        container.appendChild(catDiv);
        container.appendChild(datasetsDiv);
    });
}

// --- 3. Inject elective prompt into chatbot input and simulate sending ---
function injectPromptAndSend(category, dataset) {
    const input = document.getElementById('climateQuery');
    if (!input) return;

    // Compose elective prompt
    let prompt = `[${category.label} > ${dataset.name}]\n`;
    prompt += dataset.description ? `Dataset Description: ${dataset.description}\n` : '';
    prompt += dataset.documentation ? `Documentation: ${dataset.documentation}\n` : '';
    if (dataset.tutorials && dataset.tutorials.length) {
        prompt += `Tutorial: ${dataset.tutorials[0].title} (${dataset.tutorials[0].url})\n`;
    }
    prompt += "Proceed with this dataset for my analysis.";

    // Set input and trigger send
    input.value = prompt;
    if (window.sendClimateQuery) window.sendClimateQuery();
}

// --- 4. Initialization: Attach elective UI to chatbot area ---
async function setupScilibElectiveUI() {
    const data = await fetchScilib();
    if (!data || !data.categories) return;

    // Create container for elective UI
    let electiveContainer = document.getElementById('scilib-elective-choices');
    if (!electiveContainer) {
        electiveContainer = document.createElement('div');
        electiveContainer.id = 'scilib-elective-choices';
        electiveContainer.style.border = '1px solid #ddd';
        electiveContainer.style.padding = '10px';
        electiveContainer.style.marginBottom = '10px';
        electiveContainer.style.background = '#fafafa';
        electiveContainer.innerHTML = '<strong>Select a category and dataset to inject into the chatbot:</strong>';
        // Insert before chatbot
        const chatInput = document.getElementById('climateQuery');
        if (chatInput && chatInput.parentElement) {
            chatInput.parentElement.insertBefore(electiveContainer, chatInput);
        } else {
            document.body.insertBefore(electiveContainer, document.body.firstChild);
        }
    }

    // Render menu
    renderElectiveChoices(data.categories, electiveContainer, (cat, ds) => injectPromptAndSend(cat, ds));
}

// --- 5. Run on DOMContentLoaded ---
document.addEventListener('DOMContentLoaded', setupScilibElectiveUI);
