// const {app}=require("./app")
const session = require('express-session');
const bcrypt = require('bcrypt');
const mysql = require('mysql2');
module.exports = (app) =>{
    const tutorPool = mysql.createPool({
        connectionLimit: 10,
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'fyp'
    });
app.use(session({
    secret: 'tutor-secret-key',
    resave: false,
    saveUninitialized: true
}));

app.post('/tutor-register', async (req, res) => {
    const { tutor_name, tutor_subject, tutor_email, tutor_password } = req.body;

    // Check if any of the fields are empty
    if (!tutor_name || !tutor_subject || !tutor_email || !tutor_password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if the password meets the length requirement
    if (tutor_password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    try {
        // Hash the password with a salt
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(tutor_password, saltRounds);

        // Store the hashed password in the database
        const sql = 'INSERT INTO tutor (tutor_name, tutor_subject, tutor_email, tutor_password) VALUES (?, ?, ?, ?)';
        const values = [tutor_name, tutor_subject, tutor_email, hashedPassword];

        tutorPool.query(sql, values, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Registration failed' });
            }
            console.log('Tutor registered successfully');
            req.session.tutor = true;
            res.redirect('/public/tutor/t_index.html');
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

app.post('/tutor-login', async (req, res) => {
    const { tutor_email, tutor_password } = req.body;

    // Check if any of the fields are empty
    if (!tutor_email || !tutor_password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const sql = 'SELECT * FROM tutor WHERE tutor_email = ?';

    tutorPool.query(sql, [tutor_email], async (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Login failed' });
        }

        if (result.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const tutor = result[0];
        const hashedPassword = tutor.tutor_password;

        try {
            // Compare the entered password with the stored hash
            const passwordMatch = await bcrypt.compare(tutor_password, hashedPassword);

            if (passwordMatch) {
                console.log('Tutor logged in successfully');
                req.session.tutor = true;
                res.redirect('/tutor/tutor-dashboard.html');
            } else {
                res.status(401).json({ error: 'Invalid credentials' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Login failed' });
        }
    });
});

app.get('/tutor-logout', (req, res) => {
     // Check if the user is authenticated (if a session exists)
     if (req.session) {
        // Destroy the session to log the user out
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                res.status(500).json({ error: 'Logout failed' });
            } else {
                console.log('Logout Successfully')
                // Redirect to the login page or send a success response
                res.redirect('/public/tutor/t_index.html'); // You can replace '/login' with the actual login page URL
            }
        });
    } else {
        // If there is no session, consider the user as already logged out
        res.redirect('/public/tutor/t_index.html'); // You can replace '/login' with the actual login page URL
    }

})
app.get('/fetchTutorData', (req, res) => {
    const query = 'SELECT tutor_name, tutor_email FROM tutor';

    tutorPool.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching tutor data:', err);
            res.status(500).json({ error: 'Error fetching tutor data' });
            return;
        }
        res.json(results);
    });
});

app.post('/saveVerifyInfo', (req, res) => {
    const {
        tutor_name,
        tutor_email,
        bio,
        birthday,
        country,
        phone_no,
        resume_file,
        matrix_file,
        intermediate_file,
        bachelors_file
    } = req.body;
    // console.log(req.body)
    const insertQuery =
        'INSERT INTO verifytutor (name, email, bio, birthday, country, phone_no, resume_file, matrix_file, intermediate_file, bachelors_file) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [
        tutor_name,
        tutor_email,
        bio,
        birthday,
        country,
        phone_no,
        resume_file,
        matrix_file,
        intermediate_file,
        bachelors_file
    ];

    tutorPool.query(insertQuery, values, (err, results) => {
        if (err) {
            console.error('Error saving verify info:', err);
            res.status(500).json({ error: 'Error saving verify info' });
            return;
        }
        res.json({ message: 'Data saved to verifyinfo successfully' });
    });
});
}
