document.addEventListener('DOMContentLoaded', function () {
    // Accordion functionality for FAQs
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            // Collapse all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('p').style.maxHeight = "0";
                }
            });

            // Toggle the clicked item
            item.classList.toggle('active');
            const content = item.querySelector('p');
            if (item.classList.contains('active')) {
                content.style.maxHeight = content.scrollHeight + "px";
            } else {
                content.style.maxHeight = "0";
            }
        });
    });

    // Modal functionality for service details
    const modal = document.createElement('div');
    modal.classList.add('modal');
    document.body.appendChild(modal);

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');
    modal.appendChild(modalContent);

    const closeModal = document.createElement('span');
    closeModal.classList.add('close');
    closeModal.innerHTML = '&times;';
    modalContent.appendChild(closeModal);

    const modalText = document.createElement('div');
    modalText.classList.add('modal-text');
    modalContent.appendChild(modalText);

    const serviceButtons = document.querySelectorAll('.details-btn');

    serviceButtons.forEach(button => {
        button.addEventListener('click', () => {
            const service = button.dataset.service;
            let serviceText = '';

            switch (service) {
                case 'financial-planning':
                    serviceText = `
                        <h3>Financial Planning</h3>
                        <p>Our financial planning services are designed to help you achieve your financial goals. We take a comprehensive approach to understand your current financial situation, future goals, and risk tolerance. Our services include:</p>
                        <ul>
                            <li><strong>Budgeting and Saving Strategies:</strong> Tailored plans to help you manage your money effectively.</li>
                            <li><strong>Investment Planning:</strong> Guidance on how to grow your wealth through diversified investments.</li>
                            <li><strong>Retirement Planning:</strong> Ensuring you have enough saved for a comfortable retirement.</li>
                            <li><strong>Tax Planning:</strong> Strategies to minimize your tax liabilities.</li>
                            <li><strong>Estate Planning:</strong> Making sure your assets are distributed according to your wishes.</li>
                        </ul>`;
                    break;
                case 'investment-advice':
                    serviceText = `
                        <h3>Investment Advice</h3>
                        <p>Our investment advice services are tailored to help you grow your wealth through informed and strategic decisions. We offer:</p>
                        <ul>
                            <li><strong>Portfolio Management:</strong> Constructing and managing a portfolio tailored to your risk tolerance and investment goals.</li>
                            <li><strong>Risk Assessment and Management:</strong> Identifying potential risks and developing strategies to mitigate them.</li>
                            <li><strong>Diversification Strategies:</strong> Spreading investments across various asset classes to minimize risk.</li>
                            <li><strong>Market Analysis and Insights:</strong> Keeping you informed with the latest market trends and opportunities.</li>
                            <li><strong>Long-term Planning:</strong> Focusing on sustainable growth and wealth preservation.</li>
                        </ul>`;
                    break;
                case 'retirement-planning':
                    serviceText = `
                        <h3>Retirement Planning</h3>
                        <p>Planning for retirement involves several key steps:</p>
                        <ul>
                            <li><strong>Determining Your Retirement Needs:</strong> Estimating how much money you will need to maintain your lifestyle.</li>
                            <li><strong>Calculating Savings Goals:</strong> Setting realistic savings targets based on your current assets and future income.</li>
                            <li><strong>Choosing the Right Accounts:</strong> Selecting the most beneficial retirement accounts, such as 401(k)s, IRAs, and Roth IRAs.</li>
                            <li><strong>Investment Strategy:</strong> Developing a strategy that balances growth and security as you approach retirement.</li>
                            <li><strong>Withdrawal Planning:</strong> Creating a sustainable withdrawal plan to ensure your savings last throughout retirement.</li>
                        </ul>
                        <p>Our advisors guide you through each step, ensuring you are well-prepared for a secure and comfortable retirement.</p>`;
                    break;
                case 'tax-planning':
                    serviceText = `
                        <h3>Tax Planning</h3>
                        <p>Our tax planning services aim to optimize your financial situation by minimizing tax liabilities. We offer:</p>
                        <ul>
                            <li><strong>Identifying Tax-saving Opportunities:</strong> Finding deductions, credits, and incentives that reduce your tax burden.</li>
                            <li><strong>Tax-efficient Investments:</strong> Structuring your investments to maximize after-tax returns.</li>
                            <li><strong>Comprehensive Tax Strategies:</strong> Integrating tax planning with your overall financial plan to enhance savings.</li>
                            <li><strong>Regulatory Compliance:</strong> Ensuring all tax filings are accurate and timely.</li>
                            <li><strong>Year-round Support:</strong> Providing ongoing advice to adapt to changes in tax laws and your financial situation.</li>
                        </ul>
                        <p>We tailor our tax planning services to your unique needs, helping you keep more of what you earn.</p>`;
                    break;
                case 'estate-planning':
                    serviceText = `
                        <h3>Estate Planning</h3>
                        <p>Estate planning ensures your assets are managed and distributed according to your wishes. Our services include:</p>
                        <ul>
                            <li><strong>Creating Wills and Trusts:</strong> Establishing legal documents to outline your estate distribution.</li>
                            <li><strong>Asset Distribution Planning:</strong> Ensuring your assets go to the intended beneficiaries efficiently.</li>
                            <li><strong>Minimizing Estate Taxes:</strong> Developing strategies to reduce the tax burden on your estate.</li>
                            <li><strong>Designating Beneficiaries and Guardians:</strong> Assigning individuals to receive your assets and care for dependents.</li>
                            <li><strong>Preparing for Incapacity:</strong> Setting up powers of attorney and healthcare directives.</li>
                        </ul>
                        <p>We help you protect your legacy and provide for your loved ones with a comprehensive estate plan.</p>`;
                    break;
                case 'insurance-planning':
                    serviceText = `
                        <h3>Insurance Planning</h3>
                        <p>Insurance planning at MintedCo covers various aspects to protect you and your family:</p>
                        <ul>
                            <li><strong>Life Insurance:</strong> Ensuring financial support for your family in the event of your passing.</li>
                            <li><strong>Health Insurance:</strong> Covering medical expenses and protecting against health-related financial risks.</li>
                            <li><strong>Disability Insurance:</strong> Providing income in case you are unable to work due to injury or illness.</li>
                            <li><strong>Long-term Care Insurance:</strong> Covering costs of long-term care services, such as nursing homes or in-home care.</li>
                            <li><strong>Property and Casualty Insurance:</strong> Protecting your assets from loss or damage due to unforeseen events.</li>
                        </ul>
                        <p>Our advisors help you choose the right insurance products to meet your specific needs and goals.</p>`;
                    break;
            }

            modalText.innerHTML = serviceText;
            modal.style.display = 'block';
        });
    });

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

// Chatbox closed by default
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



document.addEventListener('DOMContentLoaded', function () {
    const timelineItems = document.querySelectorAll('.timeline-item');

    function handleScroll() {
        timelineItems.forEach(item => {
            const rect = item.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll();
});
