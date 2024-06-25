document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('username');
    const avatarPath = localStorage.getItem('avatar');
    const loginLink = document.getElementById('loginLink');
    const signupLink = document.getElementById('signupLink');
    const userDropdown = document.getElementById('userDropdown');
    const userImg = document.querySelector('.user-dropdown button img');

    if (username) {
        loginLink.style.display = 'none';
        signupLink.style.display = 'none';
        userDropdown.style.display = 'inline-block';
        userImg.alt = username;
        if (avatarPath) {
            userImg.src = avatarPath;
        }

        // Fetch and update user data
        fetch(`/get-user?username=${username}`)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    showNotification(data.error, 'error');
                } else {
                    if (data.avatar) {
                        localStorage.setItem('avatar', data.avatar); // Save avatar path to localStorage
                        userImg.src = data.avatar; // Update avatar in the nav bar
                    }
                }
            })
            .catch(error => console.error('Error fetching user data:', error));
    } else {
        loginLink.style.display = 'inline-block';
        signupLink.style.display = 'inline-block';
        userDropdown.style.display = 'none';
    }

    // Show/hide dropdown on hover
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
