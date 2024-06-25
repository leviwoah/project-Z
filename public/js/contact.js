document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        fetch('/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                alert('Message sent successfully!');
            } else {
                alert('Error sending message. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error sending message. Please try again.');
        });
    });

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

function initMap() {
    var location = {lat: -34.397, lng: 150.644};
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 8,
        center: location
    });
    var marker = new google.maps.Marker({
        position: location,
        map: map
    });
}

function loadGoogleMapsScript(apiKey) {
    var script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
}

document.addEventListener('DOMContentLoaded', function() {
    fetch('/google-maps-api-key')
        .then(response => response.json())
        .then(data => {
            loadGoogleMapsScript(data.apiKey);
        })
        .catch(error => {
            console.error('Error fetching API key:', error);
        });
});
