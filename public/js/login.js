function checkLoginStatus() {
    const username = localStorage.getItem('username');
    if (username) {
        document.getElementById('loginLink').style.display = 'none';
        document.getElementById('signupLink').style.display = 'none';
        document.getElementById('userDropdown').style.display = 'inline-block';
        document.getElementById('userButton').textContent = username;
    }
}

function login() {
    const usernameOrEmail = document.getElementById('usernameOrEmail').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    const baseUrl = "https://project-z-bay.vercel.app";

    fetch('${baseUrl}/login', {
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

document.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus();
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            login();
        }
    });

    const modal = document.getElementById("resetPasswordModal");
    if (modal) {
        const span = document.getElementsByClassName("close")[0];
        const forgotPasswordLink = document.getElementById("forgotPasswordLink");

        if (forgotPasswordLink) {
            forgotPasswordLink.onclick = function() {
                modal.style.display = "block";
            }
        }

        if (span) {
            span.onclick = function() {
                modal.style.display = "none";
            }
        }

        window.onclick = function(event) {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        }
    }

    const togglePasswordIcon = document.getElementById('togglePasswordVisibility');
    if (togglePasswordIcon) {
        togglePasswordIcon.addEventListener('click', togglePasswordVisibility);
    }
});

function sendResetPasswordRequest() {
    const email = document.getElementById('resetEmail').value;

    fetch('/reset-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            showNotification(data.error, 'error');
        } else {
            showNotification(data.message, 'success');
            setTimeout(() => {
                const modal = document.getElementById("resetPasswordModal");
                if (modal) {
                    modal.style.display = 'none';
                }
            }, 2000);
        }
    })
    .catch(error => console.error('Error:', error));
}

function togglePasswordVisibility() {
    const passwordField = document.getElementById('password');
    const toggleIcon = document.getElementById('togglePasswordVisibility');
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        toggleIcon.src = 'images/close-eye.png'; // path to the close-eye icon
        console.log("Switched to close-eye.png");
    } else {
        passwordField.type = 'password';
        toggleIcon.src = 'images/eye.png'; // path to the eye icon
        console.log("Switched to eye.png");
    }
}
