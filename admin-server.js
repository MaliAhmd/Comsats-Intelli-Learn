const mysql = require('mysql2');
const session = require('express-session');

module.exports=(app)=>{

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'fyp'
});

app.use(session({
    secret: 'admin-secret-key',
    resave: false,
    saveUninitialized: true
}));
// Serve admin-login.html as the default rout

app.post('/admin-login', (req, res) => {
    const { email, password } = req.body;

    // Check if any of the fields are empty
    if (!email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const sql = 'SELECT * FROM admin WHERE email = ? AND password = ?';

    pool.query(sql, [email, password], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Login failed' });
        }

        if (result.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Assuming the query returned a user, proceed with login
        console.log('admin logged in successfully');
        res.redirect('/public/admin/admin-dashboard.html');
    });
});

app.get('/admin-logout', (req, res) => {
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
            res.redirect('/public/admin/a_index.html'); // You can replace '/login' with the actual login page URL
        }
    });
} else {
    // If there is no session, consider the user as already logged out
    res.redirect('/public/admin/a_index.html'); // You can replace '/login' with the actual login page URL
}
});

app.get('/manage-users-details', (req, res) => {
    const query = 'SELECT  id, firstname,lastname, regno,email FROM users'; 

    pool.query(query, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to fetch tutor details' });
        }

        // Assuming you have the result with tutor details
        res.status(200).json(result); // Return the tutor details as JSON
    });
});

app.put('/update-user/:id', (req, res) => {
    const userId = req.params.id;
    const { firstname, lastname, regno, email } = req.body;

    const updateQuery = 'UPDATE users SET firstname = ?, lastname = ?, regno = ?, email = ? WHERE id = ?';

    pool.query(updateQuery, [firstname, lastname, regno, email, userId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to update user details' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User details updated successfully' });
    });
});

// Endpoint to handle user deletions
app.delete('/delete-user/:id', (req, res) => {
    const userId = req.params.id;

    const deleteQuery = 'DELETE FROM users WHERE id = ?';

    pool.query(deleteQuery, [userId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to delete user' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    });
}); 
app.get('/manage-tutors-details', (req, res) => {
    const query = 'SELECT  id, tutor_name,tutor_subject, tutor_email FROM tutor'; // Replace 'tutors' with your table name

    pool.query(query, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to fetch tutor details' });
        }

        // Assuming you have the result with tutor details
        res.status(200).json(result); // Return the tutor details as JSON
    });
});


// Handle DELETE request to delete a tutor by ID
app.delete('/delete-tutor/:id', (req, res) => {
    const tutorId = req.params.id; // Extract tutor ID from the URL parameter

    // SQL query to delete a tutor with a specific ID
    const deleteQuery = 'DELETE FROM tutor WHERE id = ?';

    pool.query(deleteQuery, [tutorId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to delete tutor' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Tutor not found' });
        }

        // Tutor successfully deleted
        res.status(200).json({ message: 'Tutor deleted successfully' });
    });
});
// Handle PUT request to update tutor details by ID
    app.put('/update-tutor/:id', (req, res) => {
        const tutorId = req.params.id; // Extract tutor ID from the URL parameter
        const { tutorName, tutorSubject, tutorEmail } = req.body; // Extract updated data from the request body

        // SQL query to update tutor details
        const updateQuery = 'UPDATE tutor SET tutor_name = ?, tutor_subject = ?, tutor_email = ? WHERE id = ?';

        pool.query(updateQuery, [tutorName, tutorSubject, tutorEmail, tutorId], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Failed to update tutor details' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Tutor not found' });
            }

            // Tutor details successfully updated
            res.status(200).json({ message: 'Tutor details updated successfully' });
        });
    });



}