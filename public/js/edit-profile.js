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
                }
            })
            .catch(error => console.error('Error fetching user data:', error));
    }

    document.getElementById('editProfileForm').addEventListener('submit', (event) => {
        event.preventDefault();
        saveProfile();
    });

    document.getElementById('changePasswordForm').addEventListener('submit', (event) => {
        event.preventDefault();
        changePassword();
    });

    // Open the Edit Profile tab by default
    document.getElementById('editProfile').style.display = 'block';
    document.querySelector('.tab-button').classList.add('active');
});

function openTab(event, tabName) {
    const tabContents = document.getElementsByClassName('tab-content');
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].style.display = 'none';
    }

    const tabButtons = document.getElementsByClassName('tab-button');
    for (let i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove('active');
    }

    document.getElementById(tabName).style.display = 'block';
    event.currentTarget.classList.add('active');
}

function saveProfile() {
    const formData = new FormData(document.getElementById('editProfileForm'));
    formData.set('username', localStorage.getItem('username')); // Ensure it's a single string value

    console.log('Username:', localStorage.getItem('username'));
    console.log('Email:', document.getElementById('email').value);
    console.log('Avatar:', formData.get('avatar'));

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

    console.log('Current Password:', formData.currentPassword);
    console.log('New Password:', formData.newPassword);
    console.log('Username:', formData.username);

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

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerText = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000); // Adjusted to match the CSS animation duration
}
