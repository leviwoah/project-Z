document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed");

    const userButton = document.getElementById('userButton');
    const userDropdown = document.getElementById('userDropdown');
    const heroCtaButton = document.getElementById('heroCtaButton'); // Ensure this element is selected

    if (userButton && userDropdown) {
        userButton.addEventListener('click', () => {
            userDropdown.classList.toggle('show');
        });
    }

    if (heroCtaButton) {
        checkLoginStatus();
    } else {
        console.error("Hero CTA button not found");
    }

    window.addEventListener('scroll', handleScrollAnimations);
});

function checkLoginStatus() {
    const username = localStorage.getItem('username');
    console.log("Username from localStorage:", username);

    const heroCtaButton = document.getElementById('heroCtaButton');
    const heroTitle = document.getElementById('heroTitle');
    const heroSubtitle = document.getElementById('heroSubtitle');

    if (!heroCtaButton || !heroTitle || !heroSubtitle) {
        console.error("Hero elements not found");
        return;
    }

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

        // Change the hero section text and CTA button for logged-in users
        console.log("User is logged in, changing hero section text and CTA button");
        heroTitle.textContent = "Welcome Back!";
        heroSubtitle.textContent = "Manage your account settings and stay updated.";
        heroCtaButton.textContent = "Account Settings";
        heroCtaButton.href = "edit-profile.html";
    } else {
        console.log("User is not logged in, setting hero section text and CTA to signup");
        heroTitle.textContent = "Take Control of Your Financial Future";
        heroSubtitle.textContent = "Join us today and start your journey towards financial freedom.";
        heroCtaButton.textContent = "Get Started";
        heroCtaButton.href = "signup.html";
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
        if (chatWidget.classList.contains('show')) {
            chatWidget.classList.remove('show');
            chatToggle.classList.remove('move-left');
        } else {
            chatWidget.classList.add('show');
            chatToggle.classList.add('move-left');
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

// Login functionality
function login() {
    const usernameOrEmail = document.getElementById('usernameOrEmail').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ usernameOrEmail, password, rememberMe })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            showNotification(data.error, 'error');
        } else {
            localStorage.setItem('username', data.username);
            showNotification('Login successful! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        }
    })
    .catch(error => console.error('Error:', error));
}

function logout() {
    localStorage.removeItem('username');
    showNotification('Logout successful!', 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerText = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000); // Adjusted to match the CSS animation duration
}
