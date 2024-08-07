document.addEventListener('DOMContentLoaded', function() {
    const stockList = document.getElementById('stock-list');

    async function fetchStockData() {
        try {
            const response = await fetch('/api/stocks');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        } catch (error) {
            console.error('Error fetching stock data:', error);
            return [];
        }
    }

    async function updateStockTicker() {
        try {
            const stocks = await fetchStockData();
            stockList.innerHTML = '';
            stocks.forEach(stock => {
                const listItem = document.createElement('li');
                listItem.textContent = `${stock.symbol}: $${stock.price}`;
                listItem.style.color = stock.change >= 0 ? 'green' : 'red';
                stockList.appendChild(listItem);
            });
            // Update timestamp on the webpage
            const updateTimeElement = document.getElementById('update-time');
            updateTimeElement.textContent = `Last updated at: ${getCachedTime()}`;
        } catch (error) {
            console.error('Error updating stock ticker:', error);
        }
    }

    let cachedTime = null;
    function getCachedTime() {
        if (!cachedTime) {
            cachedTime = new Date().toLocaleTimeString();
        }
        return cachedTime;
    }

    // Initial update
    updateStockTicker();

    // Update every 5 minutes
    setInterval(() => {
        cachedTime = null; // Reset cached time for the next update
        updateStockTicker();
    }, 300000); // 300000 ms = 5 minutes

    // Tab functionality
    window.openTab = function(event, tabName) {
        const tabContents = document.getElementsByClassName('tab-content');
        const tabButtons = document.getElementsByClassName('tab-button');

        for (let i = 0; i < tabContents.length; i++) {
            tabContents[i].classList.remove('active');
        }

        for (let i = 0; i < tabButtons.length; i++) {
            tabButtons[i].classList.remove('active');
        }

        document.getElementById(tabName).classList.add('active');
        event.currentTarget.classList.add('active');
    }

    // Set default active tab
    document.getElementsByClassName('tab-button')[0].click();
});

document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById("toolModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalBody = document.getElementById("modalBody");
    const span = document.getElementsByClassName("close")[0];

    function openTool(tool) {
        modalTitle.textContent = tool.replace(/([A-Z])/g, ' $1').trim();
        modalBody.innerHTML = `<p>This is where the ${tool} functionality will be displayed.</p>`;
        modal.style.display = "block";
    }

    span.onclick = function () {
        modal.style.display = "none";
    }

    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }

    window.openTool = openTool;
});


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
