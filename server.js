const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
const multer = require('multer');
require('dotenv').config(); // Load environment variables

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up multer for handling file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

let users = {};
let portfolios = {};

// Load data from JSON file
function loadData() {
    if (fs.existsSync('data.json')) {
        const data = JSON.parse(fs.readFileSync('data.json'));
        users = data.users;
        portfolios = data.portfolios;
    }
}

// Save data to JSON file
function saveData() {
    fs.writeFileSync('data.json', JSON.stringify({ users, portfolios }));
}

// Load initial data
loadData();

// Get user data endpoint
app.get('/get-user', (req, res) => {
    const { username } = req.query;
    const user = users[username];

    if (!user) {
        return res.status(400).json({ error: 'User not found' });
    }

    res.status(200).json({
        username,
        email: user.email,
        avatar: user.avatar
    });
});

// Signup endpoint
app.post('/signup', (req, res) => {
    const { username, email, password } = req.body;
    if (users[username] || Object.values(users).some(user => user.email === email)) {
        return res.status(400).json({ error: 'User already exists' });
    }
    users[username] = { email, password };
    portfolios[username] = [];
    saveData();
    res.status(200).json({ message: 'User created successfully' });
});

// Login endpoint
app.post('/login', (req, res) => {
    const { usernameOrEmail, password } = req.body;
    const user = users[usernameOrEmail] || Object.values(users).find(user => user.email === usernameOrEmail);
    if (!user || user.password !== password) {
        return res.status(400).json({ error: 'Invalid username/email or password' });
    }
    res.status(200).json({ message: 'Login successful', username: Object.keys(users).find(key => users[key] === user) });
});

// Logout endpoint
app.post('/logout', (req, res) => {
    res.status(200).json({ message: 'Logout successful' });
});

// Portfolio CRUD endpoints
app.get('/portfolio', (req, res) => {
    const { username } = req.query;
    if (!portfolios[username]) {
        return res.status(400).json({ error: 'User not found' });
    }
    res.status(200).json(portfolios[username]);
});

// Update password endpoint
app.post('/update-password', (req, res) => {
    const { username, currentPassword, newPassword } = req.body;

    console.log('Received update-password request:', req.body); // Log the received request data

    const user = users[username];

    if (!user) {
        console.error('User not found:', username);
        return res.status(400).json({ error: 'User not found' });
    }

    if (user.password !== currentPassword) {
        console.error('Invalid current password for user:', username);
        return res.status(400).json({ error: 'Invalid current password' });
    }

    user.password = newPassword;
    saveData();

    res.status(200).json({ message: 'Password updated successfully' });
});

// Password reset endpoint
app.post('/reset-password', (req, res) => {
    const { email } = req.body;
    const user = Object.values(users).find(user => user.email === email);

    if (!user) {
        return res.status(400).json({ error: 'Email not found' });
    }

    const token = Math.random().toString(36).substring(7); // Simple token for demonstration
    const resetLink = `http://localhost:${port}/reset-password.html?token=${token}&email=${email}`;

    // Update the user's reset token (for simplicity, not saved to file here)
    user.resetToken = token;

    // Configure the email transport using nodemailer
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'leviwoah0@gmail.com',
            pass: process.env.GMAIL_APP_PASSWORD // Use the app password from environment variable
        }
    });

    const mailOptions = {
        from: 'leviwoah0@gmail.com',
        to: email,
        subject: 'Password Reset',
        text: `Click the following link to reset your password: ${resetLink}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error sending email' });
        } else {
            console.log('Email sent: ' + info.response);
            res.status(200).json({ message: 'Password reset link sent to your email' });
        }
    });
});

// Contact endpoint
app.post('/contact', (req, res) => {
    const { name, email, subject, message } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'leviwoah0@gmail.com',
            pass: process.env.GMAIL_APP_PASSWORD // Use the app password from environment variable
        }
    });

    const mailOptions = {
        from: 'leviwoah0@gmail.com',
        to: 'leviwoah0@gmail.com',
        subject: `Contact Form Submission: ${subject}`,
        text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error sending message' });
        } else {
            console.log('Message sent: ' + info.response);
            res.status(200).json({ success: true, message: 'Message sent successfully' });
        }
    });
});

// Profile update endpoint
app.post('/update-profile', upload.single('avatar'), (req, res) => {
    const username = Array.isArray(req.body.username) ? req.body.username[0] : req.body.username;
    console.log("Received update-profile request:", req.body);
    console.log("Received file:", req.file);

    const user = users[username];

    if (!user) {
        return res.status(400).json({ error: 'User not found' });
    }

    // Update avatar if provided
    let avatarPath;
    if (req.file) {
        avatarPath = `/uploads/${req.file.filename}`;
        user.avatar = avatarPath;
    }

    saveData();

    res.status(200).json({ message: 'Profile updated successfully', avatar: avatarPath });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
