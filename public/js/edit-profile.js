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
    }

    document.querySelector('.user-dropdown').addEventListener('mouseenter', () => {
        document.querySelector('.user-dropdown-content').style.display = 'block';
    });

    document.querySelector('.user-dropdown').addEventListener('mouseleave', () => {
        document.querySelector('.user-dropdown-content').style.display = 'none';
    });

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

    fetch('/update-profile', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            showNotification(data.error, 'error');
        } else {
            localStorage.setItem('avatar', data.avatar);
            showNotification('Profile updated successfully', 'success');
        }
    })
    .catch(error => console.error('Error:', error));
}

function changePassword() {
    const formData = new FormData(document.getElementById('changePasswordForm'));

    fetch('/update-password', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
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
