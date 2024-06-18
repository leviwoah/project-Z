/*function updateProfile() {
    const form = document.getElementById('profileForm');
    const formData = new FormData(form);

    fetch('/update-profile', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            showNotification(data.error, 'error');
        } else {
            showNotification('Profile updated successfully!', 'success');
            document.getElementById('userAvatar').src = data.profilePictureUrl;
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
    }, 3000);
}

function logout() {
    fetch('/logout', { method: 'POST' })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Logout successful') {
            window.location.href = 'index.html';
        }
    })
    .catch(error => console.error('Error:', error));
}

document.addEventListener('DOMContentLoaded', () => {
    const dropdown = document.querySelector('.user-dropdown');
    const dropdownContent = document.querySelector('.user-dropdown-content');

    dropdown.addEventListener('mouseover', () => {
        dropdownContent.style.display = 'block';
    });

    dropdown.addEventListener('mouseout', () => {
        dropdownContent.style.display = 'none';
    });

    dropdownContent.addEventListener('mouseover', () => {
        dropdownContent.style.display = 'block';
    });

    dropdownContent.addEventListener('mouseout', () => {
        dropdownContent.style.display = 'none';
    });
}); */
