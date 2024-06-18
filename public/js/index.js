document.addEventListener('DOMContentLoaded', () => {
    const userButton = document.getElementById('userButton');
    const userDropdown = document.getElementById('userDropdown');

    if (userButton && userDropdown) {
        userButton.addEventListener('click', () => {
            userDropdown.classList.toggle('show');
        });
    }

    checkLoginStatus();

    const learnMoreBtn = document.querySelector('.learn-more-btn');
    if (learnMoreBtn) {
        learnMoreBtn.addEventListener('click', toggleIntroDetails);
    }
});

function toggleIntroDetails() {
    const details = document.getElementById('intro-details');
    const learnMoreBtnContainer = document.querySelector('.learn-more-btn-container');

    if (details.classList.contains('show')) {
        details.classList.remove('show');
        learnMoreBtnContainer.classList.remove('move-up');
        document.querySelector('.learn-more-btn').textContent = 'Learn More';
    } else {
        details.classList.add('show');
        learnMoreBtnContainer.classList.add('move-up');
        document.querySelector('.learn-more-btn').textContent = 'Show Less';
    }
}

function checkLoginStatus() {
    const username = localStorage.getItem('username');
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
    }
}
