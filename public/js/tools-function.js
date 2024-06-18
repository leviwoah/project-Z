document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById("toolModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalBody = document.getElementById("modalBody");
    const span = document.getElementsByClassName("close")[0];
    const username = localStorage.getItem('username');

    if (username) {
        document.getElementById('loginStatus').textContent = `Logged in as: ${username}`;
        document.getElementById('logoutButton').style.display = 'block';
    }

    const tools = {
        currencyConverter: function () {
            modalTitle.textContent = "Currency Converter";
            modalBody.innerHTML = `
                <div class="tool-description">
                    <p>Convert currencies based on the latest exchange rates.</p>
                </div>
                <form id="currencyForm" class="tool-form">
                    <div class="form-group">
                        <label for="amount">Amount:</label>
                        <input type="number" id="amount" name="amount" required>
                    </div>
                    <div class="form-group">
                        <label for="fromCurrency">From:</label>
                        <select id="fromCurrency" name="fromCurrency" required>
                            <option value="USD">USD - US Dollar</option>
                            <option value="EUR">EUR - Euro</option>
                            <option value="GBP">GBP - British Pound</option>
                            <option value="TRY">TRY - Turkish Lira</option>
                            <!-- Add more currencies as needed -->
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="toCurrency">To:</label>
                        <select id="toCurrency" name="toCurrency" required>
                            <option value="USD">USD - US Dollar</option>
                            <option value="EUR">EUR - Euro</option>
                            <option value="GBP">GBP - British Pound</option>
                            <option value="TRY">TRY - Turkish Lira</option>
                            <!-- Add more currencies as needed -->
                        </select>
                    </div>
                    <button type="button" onclick="convertCurrency()">Convert</button>
                </form>
                <div id="conversionResult"></div>
            `;
        },
        riskAssessment: function () {
            modalTitle.textContent = "Risk Assessment";
            modalBody.innerHTML = `
                <div class="tool-description">
                    <p>Evaluate the risk levels of different investment options.</p>
                </div>
                <form id="riskForm" class="tool-form">
                    <div class="form-group">
                        <label for="investmentAmount">Investment Amount:</label>
                        <input type="number" id="investmentAmount" name="investmentAmount" required>
                    </div>
                    <div class="form-group">
                        <label for="riskLevel">Risk Level (1-10):</label>
                        <input type="number" id="riskLevel" name="riskLevel" min="1" max="10" required>
                    </div>
                    <div class="form-group">
                        <label for="investmentType">Investment Type:</label>
                        <select id="investmentType" name="investmentType" required>
                            <option value="stocks">Stocks</option>
                            <option value="bonds">Bonds</option>
                            <option value="real-estate">Real Estate</option>
                            <option value="mutual-funds">Mutual Funds</option>
                            <!-- Add more types as needed -->
                        </select>
                    </div>
                    <button type="button" onclick="assessRisk()">Assess Risk</button>
                </form>
                <div id="riskResult"></div>
            `;
        },
        financialCalculator: function () {
            modalTitle.textContent = "Financial Calculator";
            modalBody.innerHTML = `
                <div class="tool-description">
                    <p>Use our financial calculators to plan your investment strategy.</p>
                </div>
                <form id="calculatorForm" class="tool-form">
                    <div class="form-group">
                        <label for="principal">Principal Amount:</label>
                        <input type="number" id="principal" name="principal" required>
                    </div>
                    <div class="form-group">
                        <label for="rate">Interest Rate (%):</label>
                        <input type="number" id="rate" name="rate" required>
                    </div>
                    <div class="form-group">
                        <label for="time">Time (years):</label>
                        <input type="number" id="time" name="time" min="1" max="100" required>
                    </div>
                    <button type="button" onclick="calculateInvestment()">Calculate</button>
                </form>
                <div id="calculationResult"></div>
            `;
        },
        marketAnalysis: function () {
            modalTitle.textContent = "Market Analysis";
            modalBody.innerHTML = `
                <div class="tool-description">
                    <p>Access in-depth market analysis and reports to make informed decisions.</p>
                </div>
                <div id="marketData">
                    <form id="marketForm" class="tool-form">
                        <div class="form-group">
                            <label for="stockSymbol">Stock Symbol:</label>
                            <input type="text" id="stockSymbol" name="stockSymbol" placeholder="Enter stock symbol (e.g., AAPL, GOOGL)">
                        </div>
                        <button type="button" onclick="fetchMarketData()">Get Data</button>
                    </form>
                </div>
            `;
        },
        investmentNews: function () {
            modalTitle.textContent = "Investment News";
            modalBody.innerHTML = `
                <div class="tool-description">
                    <p>Stay updated with the latest investment news and trends.</p>
                </div>
                <div id="newsFeed"></div>
            `;
            fetchInvestmentNews();
        },
        retirementPlanner: function () {
            modalTitle.textContent = "Retirement Planner";
            modalBody.innerHTML = `
                <div class="tool-description">
                    <p>Plan your retirement with our comprehensive tools and advice.</p>
                </div>
                <form id="retirementForm" class="tool-form">
                    <div class="form-group">
                        <label for="currentAge">Current Age:</label>
                        <input type="number" id="currentAge" name="currentAge" min="1" max="100" required>
                    </div>
                    <div class="form-group">
                        <label for="retirementAge">Retirement Age:</label>
                        <input type="number" id="retirementAge" name="retirementAge" min="1" max="100" required>
                    </div>
                    <div class="form-group">
                        <label for="monthlySavings">Monthly Savings:</label>
                        <input type="number" id="monthlySavings" name="monthlySavings" required>
                    </div>
                    <div class="form-group">
                        <label for="currentSavings">Current Savings:</label>
                        <input type="number" id="currentSavings" name="currentSavings" required>
                    </div>
                    <button type="button" onclick="planRetirement()">Plan Retirement</button>
                </form>
                <div id="retirementResult"></div>
            `;
        }
    };

    window.openTool = function(toolName) {
        if (tools[toolName]) {
            tools[toolName]();
            modal.style.display = "block";
        } else {
            console.error(`Tool function ${toolName} does not exist`);
        }
    };

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

function convertCurrency() {
    const amount = document.getElementById('amount').value;
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;
    const conversionResult = document.getElementById('conversionResult');

    if (amount && fromCurrency && toCurrency) {
        fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`)
            .then(response => response.json())
            .then(data => {
                if (data.rates[toCurrency]) {
                    const convertedAmount = (amount * data.rates[toCurrency]).toFixed(2);
                    conversionResult.innerHTML = `<p>${amount} ${fromCurrency} is equivalent to ${convertedAmount} ${toCurrency}</p>`;
                } else {
                    conversionResult.innerHTML = `<p>Invalid target currency: ${toCurrency}</p>`;
                }
            })
            .catch(error => {
                conversionResult.innerHTML = `<p>Error fetching conversion rate</p>`;
                console.error('Error fetching conversion rate:', error);
            });
    } else {
        conversionResult.innerHTML = `<p>Please fill in all fields</p>`;
    }
}

// Risk Assessment Functionality
function assessRisk() {
    const investmentAmount = document.getElementById('investmentAmount').value;
    const riskLevel = document.getElementById('riskLevel').value;
    const investmentType = document.getElementById('investmentType').value;
    const riskResult = document.getElementById('riskResult');

    if (investmentAmount && riskLevel >= 1 && riskLevel <= 10 && investmentType) {
        const riskMessage = `
            <p>For an investment of $${investmentAmount} in ${investmentType},</p>
            <p>the risk level is assessed at ${riskLevel}/10.</p>
            <p>Higher risk levels indicate higher potential returns but also higher potential losses.</p>
            <p>It's important to diversify your investments and consult with a financial advisor.</p>
        `;
        riskResult.innerHTML = riskMessage;
    } else {
        riskResult.textContent = 'Please fill in all fields and ensure risk level is between 1 and 10.';
    }
}

// Financial Calculator Functionality
function calculateInvestment() {
    const principal = document.getElementById('principal').value;
    const rate = document.getElementById('rate').value;
    const time = document.getElementById('time').value;
    const calculationResult = document.getElementById('calculationResult');

    if (principal && rate && time >= 1 && time <= 100) {
        const amount = principal * Math.pow((1 + rate / 100), time);
        calculationResult.textContent = `The future value of your investment is $${amount.toFixed(2)}.`;
    } else {
        calculationResult.textContent = 'Please enter valid inputs.';
    }
}

// Market Analysis Functionality
function fetchMarketData() {
    const stockSymbol = document.getElementById('stockSymbol').value || 'AAPL';
    const marketData = document.getElementById('marketData');
    marketData.innerHTML = `<p>Loading market data...</p>`;
    fetch(`https://finnhub.io/api/v1/quote?symbol=${stockSymbol}&token=cpk8afpr01qs6dmbuhogcpk8afpr01qs6dmbuhp0`)
        .then(response => response.json())
        .then(data => {
            marketData.innerHTML = `
                <div class="market-info">
                    <p><strong>Stock:</strong> ${stockSymbol.toUpperCase()}</p>
                    <p><strong>Current Price:</strong> $${data.c}</p>
                    <p><strong>Change:</strong> ${data.d}</p>
                </div>
            `;
        })
        .catch(error => {
            marketData.innerHTML = `<p>Error fetching market data</p>`;
            console.error('Error fetching market data:', error);
        });
}

// Investment News Functionality
function fetchInvestmentNews() {
    const newsFeed = document.getElementById('newsFeed');
    newsFeed.innerHTML = `<p>Loading investment news...</p>`;
    fetch('https://newsapi.org/v2/top-headlines?category=business&apiKey=d6a445cb40884b898d0c1d20e02196d4')
        .then(response => response.json())
        .then(data => {
            newsFeed.innerHTML = data.articles.map(article => `
                <div class="news-article">
                    <h4>${article.title}</h4>
                    <p>${article.description}</p>
                    <a href="${article.url}" target="_blank" class="read-more">Read more</a>
                </div>
            `).join('');
        })
        .catch(error => {
            newsFeed.innerHTML = `<p>Error fetching investment news</p>`;
            console.error('Error fetching investment news:', error);
        });
}

// Retirement Planner Functionality
function planRetirement() {
    const currentAge = document.getElementById('currentAge').value;
    const retirementAge = document.getElementById('retirementAge').value;
    const monthlySavings = document.getElementById('monthlySavings').value;
    const currentSavings = document.getElementById('currentSavings').value;
    const retirementResult = document.getElementById('retirementResult');
    if (currentAge && retirementAge && monthlySavings && currentSavings) {
        const yearsToSave = retirementAge - currentAge;
        const totalSavings = parseFloat(currentSavings) + (parseFloat(monthlySavings) * 12 * yearsToSave);
        retirementResult.textContent = `By the age of ${retirementAge}, you will have saved $${totalSavings.toFixed(2)}.`;
    }
}
