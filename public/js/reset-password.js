function getQueryParams() {
    const params = {};
    const queryString = window.location.search.substring(1);
    const regex = /([^&=]+)=([^&]*)/g;
    let m;

    while (m = regex.exec(queryString)) {
        params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }
    return params;
}

function resetPassword() {
    const params = getQueryParams();
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const email = params.email;
    const token = params.token;

    if (newPassword !== confirmPassword) {
        document.getElementById('resetMessage').textContent = 'Passwords do not match';
        return;
    }

    fetch('/reset-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, token, newPassword })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            document.getElementById('resetMessage').textContent = data.error;
        } else {
            document.getElementById('resetMessage').textContent = 'Password reset successfully. Redirecting to login...';
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 3000);
        }
    })
    .catch(error => console.error('Error:', error));
}

document.addEventListener('DOMContentLoaded', () => {
    const params = getQueryParams();
    const email = params.email;
    const token = params.token;

    // Check if email and token are present in the URL
    if (!email || !token) {
        document.getElementById('resetMessage').textContent = 'Invalid or expired token';
        return;
    }

    // Optional: Verify token expiration client-side before showing the form
    try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const exp = decodedToken.exp * 1000; // Convert to milliseconds
        if (Date.now() > exp) {
            document.getElementById('resetMessage').textContent = 'Token has expired';
            return;
        }
    } catch (error) {
        document.getElementById('resetMessage').textContent = 'Invalid token';
        return;
    }
});
