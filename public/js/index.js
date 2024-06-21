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
