function checkLoginStatus() {
    const username = localStorage.getItem('username');
    if (username) {
        document.getElementById('signupForm').style.display = 'none';
        document.getElementById('loginLink').style.display = 'none';
        document.getElementById('signupLink').style.display = 'none';
        document.getElementById('userDropdown').style.display = 'inline-block';
        document.getElementById('userButton').textContent = username;
    }
}

function signup() {
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            showNotification(data.error, 'error');
        } else {
            showNotification('Signup successful! You can now log in.', 'success');
            setTimeout(() => {
                window.location.href = 'login.html';
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
    }, 3000);
}

function checkPasswordStrength() {
    const password = document.getElementById('password').value;
    const strengthIndicator = document.getElementById('strengthIndicator');
    let strength = 'Weak';

    if (password.length > 8 && /[A-Z]/.test(password) && /\d/.test(password) && /[!@#$%^&*]/.test(password)) {
        strength = 'Strong';
    } else if (password.length > 6 && /[A-Z]/.test(password) && /\d/.test(password)) {
        strength = 'Moderate';
    }

    strengthIndicator.textContent = `Strength: ${strength}`;
    strengthIndicator.style.color = strength === 'Strong' ? 'green' : (strength === 'Moderate' ? 'orange' : 'red');
}

document.getElementById('togglePassword').addEventListener('click', function () {
    const passwordField = document.getElementById('password');
    const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordField.setAttribute('type', type);
    this.src = type === 'password' ? 'images/eye.png' : 'images/close-eye.png';
});

document.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus();
    document.getElementById('password').addEventListener('input', checkPasswordStrength);
});
