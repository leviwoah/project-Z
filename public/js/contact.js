document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(form);
        const data = {};
        const baseUrl = "https://project-z-bay.vercel.app";
        formData.forEach((value, key) => {
            data[key] = value;
        });

        fetch('${baseUrl}/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                alert('Message sent successfully!');
            } else {
                alert('Error sending message. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error sending message. Please try again.');
        });
    });
});
