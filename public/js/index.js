document.addEventListener('DOMContentLoaded', () => {
    const userButton = document.getElementById('userButton');
    const userDropdown = document.getElementById('userDropdown');

    if (userButton && userDropdown) {
        userButton.addEventListener('click', () => {
            userDropdown.classList.toggle('show');
        });
    }

    checkLoginStatus();

    window.addEventListener('scroll', handleScrollAnimations);
});

function checkLoginStatus() {
    const username = localStorage.getItem('username');
    const heroContent = document.getElementById('heroContent');
    const heroCtaButton = document.getElementById('heroCtaButton');

    if (username) {
        document.getElementById('loginLink').style.display = 'none';
        document.getElementById('signupLink').style.display = 'none';
        const userDropdown = document.getElementById('userDropdown');
        if (userDropdown) {
            userDropdown.style.display = 'inline-block';
            const userButton = document.getElementById('userButton');
            if (userButton) {
                userButton.textContent = username;
            }
        }

        // Change hero section content for logged-in users
        heroContent.innerHTML = `
            <h1>Welcome Back, ${username}!</h1>
            <p>Continue managing your investments and planning your financial future with MintedCo.</p>
            <a href="dashboard.html" class="cta-button">Go to Dashboard</a>
        `;
    }
}

function handleScrollAnimations() {
    const features = document.querySelectorAll('.feature');
    const windowHeight = window.innerHeight;

    features.forEach(feature => {
        const featureTop = feature.getBoundingClientRect().top;
        if (featureTop < windowHeight - 50) {
            feature.classList.add('visible');
        } else {
            feature.classList.remove('visible');
        }
    });
}



document.addEventListener("DOMContentLoaded", function() {
    const chatWidget = document.querySelector('.chat-widget');
    const chatToggle = document.getElementById('chat-toggle');
    const chatClose = document.querySelector('.chat-close');

    function toggleChatWidget() {
        console.log('toggleChatWidget called');
        if (chatWidget.classList.contains('show')) {
            chatWidget.classList.remove('show');
            chatToggle.classList.remove('move-left');
            console.log('Chat widget hidden');
        } else {
            chatWidget.classList.add('show');
            chatToggle.classList.add('move-left');
            console.log('Chat widget shown');
        }
    }

    chatToggle.addEventListener('click', toggleChatWidget);
    chatClose.addEventListener('click', toggleChatWidget);

    window.sendMessage = function sendMessage() {
        const userInput = document.getElementById('user-input');
        const userMessage = userInput.value.trim();
        if (userMessage) {
            addChatMessage('User', userMessage);
            getAIResponse(userMessage);
            userInput.value = '';
        }
    }

    function getAIResponse(message) {
        fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        })
            .then(response => response.json())
            .then(data => {
                const aiMessage = data.response;
                addChatMessage('Advisor', aiMessage);
            })
            .catch(error => {
                console.error('Error:', error);
                addChatMessage('Advisor', 'Sorry, something went wrong. Please try again later.');
            });
    }

    function addChatMessage(sender, message) {
        const chatMessages = document.getElementById('chat-messages');
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message');
        messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to the bottom
    }

    // Initialize the chat with a welcome message
    addChatMessage('Advisor', 'Welcome to MintedCo! How can I assist you today?');
});
