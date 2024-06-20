const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
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
let resetTokens = {}; // Store reset tokens temporarily

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

// Rate limit for signup endpoint
const signupLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: 'Too many signup attempts from this IP, please try again after 15 minutes'
});

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

// Signup endpoint with validation, rate limiting, and reCAPTCHA verification
app.post('/signup', signupLimiter, [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, recaptchaToken } = req.body;

    // Verify reCAPTCHA token
    try {
        const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`);
        if (!response.data.success) {
            return res.status(400).json({ error: 'reCAPTCHA verification failed' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Error verifying reCAPTCHA' });
    }

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

// Password reset request endpoint
app.post('/request-reset-password', (req, res) => {
    const { email } = req.body;
    const user = Object.values(users).find(user => user.email === email);

    if (!user) {
        return res.status(400).json({ error: 'Email not found' });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '5m' });
    resetTokens[token] = true; // Store the token for one-time use
    console.log('Generated token:', token); // Log the generated token
    const resetLink = `http://localhost:${port}/reset-password.html?token=${token}`;

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

// Password reset endpoint
app.post('/reset-password', (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded); // Log the decoded token
        if (!resetTokens[token]) {
            console.error('Token not found or already used:', token);
            return res.status(400).json({ error: 'Invalid or expired token' });
        }

        delete resetTokens[token]; // Remove the token after it is used
        console.log('Token removed:', token); // Log the token removal
        const email = decoded.email;
        const user = Object.values(users).find(user => user.email === email);

        if (!user) {
            console.error('User not found:', email);
            return res.status(400).json({ error: 'User not found' });
        }

        user.password = newPassword;
        saveData();
        console.log('Password updated for user:', email); // Log the password update

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(400).json({ error: 'Invalid or expired token' });
    }
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
    const { username } = req.body;
    const user = users[username];

    if (!user) {
        return res.status(400).json({ error: 'User not found' });
    }

    // Update email if provided (not required for this case)
    if (req.body.email) {
        user.email = req.body.email;
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

// Password update endpoint
app.post('/update-password', (req, res) => {
    const { username, currentPassword, newPassword } = req.body;

    // Log received data to verify
    console.log('Received update-password request:', req.body);

    const user = users[username];

    if (!user || user.password !== currentPassword) {
        return res.status(400).json({ error: 'Invalid current password or user not found' });
    }

    user.password = newPassword;
    saveData();
    res.status(200).json({ message: 'Password updated successfully' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
