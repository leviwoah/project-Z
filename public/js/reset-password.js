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
    const token = params.token;

    if (newPassword !== confirmPassword) {
        document.getElementById('resetMessage').textContent = 'Passwords do not match';
        return;
    }

    fetch('/reset-password-confirm', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token, newPassword })
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
