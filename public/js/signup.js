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

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

function onClick(token) {
    if (document.getElementById('signupButton').disabled) {
        return;
    }
    signup(token);
}

function signup(token) {
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const signupButton = document.getElementById('signupButton');

    if (!validateEmail(email)) {
        showNotification('Invalid email address', 'error');
        signupButton.disabled = false;
        return;
    }

    if (password.length < 6) {
        showNotification('Password must be at least 6 characters long', 'error');
        signupButton.disabled = false;
        return;
    }

    signupButton.disabled = true;

    fetch('/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password, recaptchaToken: token })
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => { throw new Error(text); });
        }
        return response.json();
    })
    .then(data => {
        if (data.errors) {
            showNotification(data.errors.map(err => err.msg).join(', '), 'error');
        } else if (data.error) {
            showNotification(data.error, 'error');
        } else {
            showNotification('Signup successful! You can now log in.', 'success');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        }
    })
    .catch(error => {
        showNotification(error.message, 'error');
    })
    .finally(() => {
        signupButton.disabled = false;
    });
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
    const strengthBar = document.querySelector('.strength-bar');

    let strength = 'Very Weak';
    let strengthClass = 'strength-very-weak';
    let filledBars = 1;

    if (password.length > 12 && /[A-Z]/.test(password) && /\d/.test(password) && /[!@#$%^&*]/.test(password)) {
        strength = 'Very Strong';
        strengthClass = 'strength-very-strong';
        filledBars = 5;
    } else if (password.length > 10 && /[A-Z]/.test(password) && /\d/.test(password) && /[!@#$%^&*]/.test(password)) {
        strength = 'Strong';
        strengthClass = 'strength-strong';
        filledBars = 4;
    } else if (password.length > 8 && /[A-Z]/.test(password) && /\d/.test(password)) {
        strength = 'Moderate';
        strengthClass = 'strength-moderate';
        filledBars = 3;
    } else if (password.length > 6 && /[A-Z]/.test(password)) {
        strength = 'Weak';
        strengthClass = 'strength-weak';
        filledBars = 2;
    } else {
        strength = 'Very Weak';
        strengthClass = 'strength-very-weak';
        filledBars = 1;
    }

    strengthIndicator.textContent = `Strength: ${strength}`;
    strengthIndicator.style.display = 'block';

    strengthBar.className = `strength-bar ${strengthClass}`;
    strengthBar.style.display = 'flex';

    const bars = strengthBar.querySelectorAll('div');
    bars.forEach((bar, index) => {
        bar.style.backgroundColor = index < filledBars ? '' : '#ddd';
    });

    if (password.length === 0) {
        strengthIndicator.style.display = 'none';
        strengthBar.style.display = 'none';
    } else {
        const eyeIcon = document.getElementById('togglePassword');
        if (eyeIcon) {
            eyeIcon.classList.add('moved-up');
        }
    }
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
    
    const signupButton = document.getElementById('signupButton');
    if (!signupButton.dataset.listener) {
        signupButton.addEventListener('click', (event) => {
            event.preventDefault();
            if (!signupButton.disabled) {
                signupButton.disabled = true;
                grecaptcha.ready(function() {
                    grecaptcha.execute('6Le9qP0pAAAAAGGyGtqWZfuYdfRRdkjbRjJPaTDV', {action: 'submit'}).then(function(token) {
                        onClick(token);
                    });
                });
            }
        });
        signupButton.dataset.listener = true;
    }
});
