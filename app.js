const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const crypto = require('crypto'); // Import the crypto module
const session = require('express-session'); // Import the express-session module
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const tutor_server = require('./tutor-server')
const admin_server=require('./admin-server')
const app = express();
const port = process.env.PORT || 5000;

app.use(cookieParser());
app.use(express.static('public'));



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
tutor_server(app)
admin_server(app)
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'fyp'
});


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/Main/main.html'));
  });
  
  // Serve other static files
  app.use(express.static(path.join(__dirname)));


// Handle user registration
// Handle user registration
app.post('/register', async (req, res) => {
  const { firstname, lastname, regno, email, password } = req.body;

  // Check if any of the fields are empty
  if (!firstname || !lastname || !regno || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
  }

  // Check if the password meets the length requirement
  if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
  }

  try {
      // Hash the password with a salt (the higher the saltRounds, the more secure but slower)
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Store the hashed password in the database
      const sql = 'INSERT INTO users (firstname, lastname, regno, email, password) VALUES (?, ?,?, ?, ?)';
      const values = [firstname, lastname, regno, email, hashedPassword];

      pool.query(sql, values, (err, result) => {
          if (err) {
              console.error(err);
              return res.status(500).json({ error: 'Registration failed' });
          }
          console.log('User registered successfully');
          res.redirect('/public/student/s_index.html')
        //   res.status(200).json({ message: 'Registration successful' });
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Registration failed' });
  }
});

// Handle user login
app.post('/login', async (req, res) => {
  const { regno, password } = req.body;

  // Check if any of the fields are empty
  if (!regno || !password) {
      return res.status(400).json({ error: 'All fields are required' });
  }

  const sql = 'SELECT * FROM users WHERE regno = ?';

  pool.query(sql, [regno], async (err, result) => {
      if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Login failed' });
      }

      if (result.length === 0) {
          return res.status(401).json({ error: 'Invalid credentials' });
      }

      const user = result[0];
      const hashedPassword = user.password;

      try {
          // Compare the entered password with the stored hash
          const passwordMatch = await bcrypt.compare(password, hashedPassword);

          if (passwordMatch) {
              console.log('User logged in successfully');
              // Set a cookie upon successful login
              res.cookie('user_auth', 'authenticated', { httpOnly: true });
            //   res.status(200).json({ message: 'Login successful' });
                res.redirect('/student/dashbaord.html')
                
          } else {
              res.status(401).json({ error: 'Invalid credentials' });
          }
      } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Login failed' });
      }
  });
});

const secretKey = crypto.randomBytes(64).toString('hex');
console.log('Generated Secret Key:', secretKey); // Log the generated key (for debugging)

// // Use express-session middleware for session management with the generated secret key
// app.use(session({
//     secret: secretKey, // Use the generated secret key for session encryption
//     resave: false,
//     saveUninitialized: false,
// }));

// Your other routes and middleware...
app.use(express.static('public'));
// Logout route
// Logout route
app.get('/logout', (req, res) => {
    // Check if the user is authenticated (if a session exists)
    if (req.session) {
        // Destroy the session to log the user out
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                res.status(500).json({ error: 'Logout failed' });
            } else {
                console.log('Logout Successfully')
                // Remove the cookie upon logout
                res.clearCookie('user_auth'); // Remove the cookie named 'user_auth'
                // Redirect to the login page or send a success response
                res.redirect('/public/student/s_index.html'); // You can replace '/login' with the actual login page URL
            }
        });
    } else {
        // If there is no session, consider the user as already logged out
        res.redirect('/public/student/s_index.html'); // You can replace '/login' with the actual login page URL
    }
});



app.listen(port, () => console.log(`Listening on port ${port}`));
module.exports = {pool}