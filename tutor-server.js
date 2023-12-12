const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const mysql = require('mysql2');
const jwt=require('jsonwebtoken')
const auth = require('./Middleware/auth')
const cors = require('cors')
const multer = require('multer');
const path = require('path');
const fs = require('fs');


module.exports = (app) =>{
    const tutorPool = mysql.createPool({
        connectionLimit: 10,
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'fyp'
    });

    app.use(cors({
        origin:'http://localhost:5000',
        credentials:true,   
    }));
    app.use('/documents', express.static(path.join(__dirname, 'public/documents')));
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
        let token
        try {
            // Compare the entered password with the stored hash
            const passwordMatch = await bcrypt.compare(tutor_password, hashedPassword);

            if (passwordMatch) {
                console.log('Tutor logged in successfully');
                token= await jwt.sign(
                    {id:tutor.id,email:tutor_email},
                    "Comsats_Intelli-learn",
                    {expiresIn: '1h'}
                  )
                  res.status(200).json({result,token})
                // res.redirect('/tutor/tutor-dashboard.html');
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
     try{
        res.status(200)
        .cookie('token',null,{expires: new Date(Date.now()),httpOnly:true,sameSite:'None',secure:true})
        .json({
            success:true,
            message:"logout!"
        })
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }

})
app.get('/fetchTutorData/:id',auth,(req, res) => {
    const fetchid=req.params.id;
    const query = 'SELECT tutor_name, tutor_email FROM tutor where id=?';

    tutorPool.query(query, [fetchid], (err, results) => {
        if (err) {
            console.error('Error fetching tutor data:', err);
            res.status(500).json({ error: 'Error fetching tutor data' });
            return;
        }
        res.json(results);
    });
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const tutorEmail = req.body.tutor_email;// Get tutor's email from the request
        // console.log(tutorEmail);    
         // Create folder if it doesn't exist
         const folderPath = `./public/documents/${tutorEmail}`;
         
         // Create folder if it doesn't exist
         if (!fs.existsSync(folderPath)) {
             fs.mkdirSync(folderPath, { recursive: true });
         }
         
         cb(null, folderPath);// Chang // Set the destination directory for uploaded files
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Rename files with a unique name to avoid conflicts
    }
});
const upload = multer({ storage: storage });
app.post('/saveVerifyInfo', auth, upload.fields([
    { name: 'resume_file', maxCount: 1 }, // Assuming 'resume_file' is the field name for resume file upload
    { name: 'matrix_file', maxCount: 1 },
    { name: 'intermediate_file', maxCount: 1 },
    { name: 'bachelors_file', maxCount: 1 }
]), (req, res) => {
    const {
        tutor_name,
        tutor_email,
        bio,
        birthday,
        country,
        phone_no
    } = req.body;

    // Access uploaded files from req.files object
    const resume_file = req.files['resume_file'][0].filename;
    const matrix_file = req.files['matrix_file'][0].filename;
    const intermediate_file = req.files['intermediate_file'][0].filename;
    const bachelors_file = req.files['bachelors_file'][0].filename;

    // Proceed with database insertion as you were doing
    const insertQuery =
        'INSERT INTO verifytutor (name, email, bio, birthday, country, phone_no, resume_file, matrix_file, intermediate_file, bachelors_file, tutorid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
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
        bachelors_file,
        req.user.id
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


app.get('/fetchTutorverifyinfo',auth, (req, res) => {
    const id = req.user.id
    const query = 'SELECT bio, birthday,country,phone_no,resume_file,matrix_file,intermediate_file,bachelors_file FROM verifytutor where tutorId = ?';

    tutorPool.query(query,[id],(err, results) => {
        if (err) {
            console.error('Error fetching tutor verify data:', err);
            res.status(500).json({ error: 'Error fetching tutor verify data' });
            return;
        }
        res.json(results);
    });
});

// app.get('/getFiles/:id',auth,(req,res)=>{
//     const id = req.params.id
//     const query = 'SELECT * FROM verifytutor WHERE tutorId = ?'
//     tutorPool.query(query,[id],(err, results) => {
//         if (err) {
//             console.error('Error fetching tutor verify data:', err);
//             res.status(500).json({ error: 'Error fetching tutor verify data' });
//             return;
//         }
//         console.log(results)
//         res.json(results);
//     });
// })

app.get('/getFiles/:id', auth, (req, res) => {
    // const id = req.user.id;
    const id = req.params.id;
    const query = 'SELECT bio, birthday, country, phone_no, resume_file, matrix_file, intermediate_file, bachelors_file FROM verifytutor WHERE tutorId = ?';

    tutorPool.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error fetching tutor verify data:', err);
            res.status(500).json({ error: 'Error fetching tutor verify data' });
            return;
        }

        // Assuming results is an array containing the fetched data
        if (results.length > 0) {
            const tutorData = results[0]; // Considering only the first row

            // Read file paths from the database query results
            const resumeFilePath = path.join(__dirname, `public/documents/${req.user.email}/${tutorData.resume_file}`);
            // const resumeFilePath = tutorData.resume_file;
            const matrixFilePath = path.join(__dirname, `public/documents/${req.user.email}/${tutorData.matrix_file}`);
            // const matrixFilePath = tutorData.matrix_file;
            const intermediateFilePath = path.join(__dirname, `public/documents/${req.user.email}/${tutorData.intermediate_file}`);
            // const intermediateFilePath = tutorData.intermediate_file;
            const bachelorsFilePath = path.join(__dirname, `public/documents/${req.user.email}/${tutorData.bachelors_file}`);

            // const bachelorsFilePath = tutorData.bachelors_file;

            // Read file contents and send as response
            const filesToSend = {};

            // Read and send each file asynchronously
            function readFileAndSend(filePath, fileName) {
                fs.readFile(filePath, (err, fileData) => {
                    if (err) {
                        console.error(`Error reading file ${fileName}:`, err);
                        filesToSend[fileName] = null;
                    } else {
                        filesToSend[fileName] = fileData;
                    }

                    // Check if all files have been read
                    if (
                        filesToSend.resume &&
                        filesToSend.matrix &&
                        filesToSend.intermediate &&
                        filesToSend.bachelors
                    ) {
                        res.json(filesToSend); // Send all files as a response
                    }
                });
            }

            // Read and send each file
            readFileAndSend(resumeFilePath, 'resume');
            readFileAndSend(matrixFilePath, 'matrix');
            readFileAndSend(intermediateFilePath, 'intermediate');
            readFileAndSend(bachelorsFilePath, 'bachelors');
        } else {
            res.status(404).json({ error: 'Tutor data not found' });
        }
    });
});


app.get('/showstudenttotutor/:id',auth, (req, res) => {
    const id = req.params.id;
    const query = 'SELECT * FROM enrollstudent WHERE tutor_id = ? ';

    tutorPool.query(query,[id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to show student to tutor' });
        }

        // Assuming you have the result with tutor details
        res.status(200).json(result); // Return the tutor details as JSON
    });
});
}






app.get('/documents/:tutorEmail/:filename', (req, res) => {
    const tutorEmail = req.params.tutorEmail;
    const filename = req.params.filename;
    const filePath = path.join(__dirname, `public/documents/${tutorEmail}/${filename}`);

    // Check if the file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error('File does not exist:', err);
            return res.status(404).json({ error: 'File not found' });
        }

        // If the file exists, serve it
        res.sendFile(filePath);
    });
});




