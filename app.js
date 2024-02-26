const express = require('express');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cookieParser());
// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

const upload = multer({ storage: storage });

app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});


// Login Page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Signup Page
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'signup.html'));
});

// Endpoint to fetch quiz data
app.get('/quizzes', (req, res) => {
    try {
        // Read quiz data JSON file
        const data = fs.readFileSync('quiz_data.json');
        const quizzes = JSON.parse(data);
        res.json(quizzes);
    } catch (error) {
        console.error('Error reading quiz data:', error);
        res.status(500).send('Error fetching quiz data.');
    }
});

// Handle form submission for signup
app.post('/signup', (req, res) => {
    const { username, password, confirmPassword } = req.body;

    // Check if password and confirm password match
    if (password !== confirmPassword) {
        return res.status(400).send('Passwords do not match.');
    }

    // Save user data to a JSON file (you can enhance this by hashing the passwords)
    const userData = { username, password };
    fs.writeFileSync('users.json', JSON.stringify(userData));

    res.redirect('/');
});

// Handle form submission for login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Read user data from JSON file
    const userData = JSON.parse(fs.readFileSync('users.json', 'utf8'));

    // Check if the provided username and password match
    if (userData && userData.username === username && userData.password === password) {
        // Set a cookie with the username
        res.cookie('username', username);
        // Redirect to index.html
        res.redirect('/home');
    } else {
        res.status(401).send('Invalid username or password.');
    }
});

// Serve homepage
app.get('/home', (req, res) => {
    // Check if the username cookie exists
    const username = req.cookies.username;
    if (username) {
        res.sendFile(path.join(__dirname, 'index.html'));
    } else {
        res.redirect('/login'); // Redirect to login if not logged in
    }
});



// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
