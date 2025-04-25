Lfunction handleSubmit(event) {
    event.preventDefault();

    // Get form values
    const formData = {
        name: event.target[0].value,
        email: event.target[1].value,
        message: event.target[2].value
    };

    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
        alert('Please fill in all fields');
        return;
    }

    // Create issue in GitHub
    createGitHubIssue(formData);

    // Show success message
    alert('Message sent successfully! We\'ll respond within 24 hours.');

    // Reset form
    event.target.reset();
}

function createGitHubIssue(formData) {
    const repo = 'aimtyaem/RA-Space-exploration';
    const url = `https://api.github.com/repos/${repo}/issues`;
    const token = 'YOUR_PERSONAL_ACCESS_TOKEN'; // Replace with a GitHub personal access token

    const issueData = {
        title: `Contact Form Submission from ${formData.name}`,
        body: `**Name:** ${formData.name}\n**Email:** ${formData.email}\n**Message:**\n${formData.message}`
    };

    fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(issueData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Issue created:', data);
    })
    .catch(error => {
        console.error('Error creating issue:', error);
    });
}

// Add input validation styling
document.querySelectorAll('input, textarea').forEach(element => {
    element.addEventListener('invalid', (e) => {
        e.target.style.borderColor = '#ff4757';
    });

    element.addEventListener('input', (e) => {
        e.target.style.borderColor = '#2a2f45';
    });
});
