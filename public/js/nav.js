document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('username');
    const avatarPath = localStorage.getItem('avatar');

    if (username) {
        document.getElementById('loginLink').style.display = 'none';
        document.getElementById('signupLink').style.display = 'none';
        document.getElementById('userDropdown').style.display = 'inline-block';
        document.querySelector('.user-dropdown img').alt = username;
        if (avatarPath) {
            document.querySelector('.user-dropdown img').src = avatarPath;
        }
    } else {
        document.getElementById('loginLink').style.display = 'inline-block';
        document.getElementById('signupLink').style.display = 'inline-block';
        document.getElementById('userDropdown').style.display = 'none';
    }

    document.querySelector('.user-dropdown').addEventListener('mouseenter', () => {
        document.querySelector('.user-dropdown-content').style.display = 'block';
    });

    document.querySelector('.user-dropdown').addEventListener('mouseleave', () => {
        document.querySelector('.user-dropdown-content').style.display = 'none';
    });
});

function logout() {
    localStorage.removeItem('username');
    localStorage.removeItem('avatar');
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
