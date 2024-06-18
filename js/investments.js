document.addEventListener('DOMContentLoaded', function() {
    const stockList = document.getElementById('stock-list');
    const apiKey = 'cpk8afpr01qs6dmbuhogcpk8afpr01qs6dmbuhp0'; // Your Finnhub API key

    async function fetchStockData() {
        const symbols = ['AAPL', 'GOOGL', 'AMZN', 'MSFT', 'TSLA', 'META', 'NFLX', 'NVDA', 'BABA', 'UBER'];
        const promises = symbols.map(symbol => 
            fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log(`Data for ${symbol}:`, data);
                    if (!data.c) {
                        console.error(`No price data for ${symbol}`);
                        return { symbol: symbol, price: 'N/A', change: 0 };
                    }
                    return {
                        symbol: symbol,
                        price: parseFloat(data.c).toFixed(2),
                        change: parseFloat(data.d).toFixed(2)
                    };
                })
                .catch(error => {
                    console.error('Error fetching data for symbol:', symbol, error);
                    return { symbol: symbol, price: 'N/A', change: 0 };
                })
        );

        return Promise.all(promises);
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
