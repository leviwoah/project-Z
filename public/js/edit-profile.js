function openTab(event, tabName) {
    const tabContents = document.querySelectorAll('.tab-content');
    const tabButtons = document.querySelectorAll('.tab-button');

    tabContents.forEach(content => {
        content.style.display = 'none';
    });

    tabButtons.forEach(button => {
        button.classList.remove('active');
    });

    document.getElementById(tabName).style.display = 'block';
    if (event) {
        event.currentTarget.classList.add('active');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('username');

    if (username) {
        fetch(`/get-user?username=${username}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.error) {
                    showNotification(data.error, 'error');
                } else {
                    document.getElementById('username').value = data.username;
                    document.getElementById('email').value = data.email;
                    document.getElementById('bio').value = data.bio || '';
                }
            })
            .catch(error => console.error('Error fetching user data:', error));
    }

    // Open the Edit Profile tab by default
    openTab(null, 'editProfile');
    document.querySelector('.tab-button').classList.add('active');
});

function saveProfile() {
    const formData = new FormData(document.getElementById('editProfileForm'));
    formData.set('username', localStorage.getItem('username'));

    fetch('/update-profile', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.error) {
            showNotification(data.error, 'error');
        } else {
            localStorage.setItem('avatar', data.avatar);
            showNotification('Profile updated successfully', 'success');
            // Update the avatar image in the navigation
            document.querySelector('.user-dropdown img').src = data.avatar;
        }
    })
    .catch(error => console.error('Error:', error));
}

function changePassword() {
    const formData = {
        username: localStorage.getItem('username'),
        currentPassword: document.getElementById('currentPassword').value,
        newPassword: document.getElementById('newPassword').value,
    };

    fetch('/update-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.error) {
            showNotification(data.error, 'error');
        } else {
            showNotification('Password changed successfully', 'success');
        }
    })
    .catch(error => console.error('Error:', error));
}

function deleteAccount() {
    const username = localStorage.getItem('username');

    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        fetch('/delete-account', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                showNotification(data.error, 'error');
            } else {
                showNotification('Account deleted successfully', 'success');
                localStorage.clear();
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            }
        })
        .catch(error => console.error('Error:', error));
    }
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
