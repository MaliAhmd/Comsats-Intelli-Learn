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
const { log } = require('console');


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
    app.use('/tutorcourses', express.static(path.join(__dirname, 'public/tutorcourses')));
    app.use('/public', express.static(path.join(__dirname, 'public')));

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
            res.redirect('/public/tutor/Frontend/t_index.html');
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
        console.log(tutorEmail);    
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
    { name: 'bachelors_file', maxCount: 1 },
    { name: 't_image', maxCount: 1 }
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
    const t_image = req.files['t_image'][0].filename;
    // Proceed with database insertion as you were doing
    const insertQuery =
        'INSERT INTO verifytutor (t_image,name, email, bio, birthday, country, phone_no, resume_file, matrix_file, intermediate_file, bachelors_file, tutorid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [
        t_image,
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
    const query = 'SELECT t_image,bio, birthday,country,phone_no,resume_file,matrix_file,intermediate_file,bachelors_file FROM verifytutor where tutorId = ?';

    tutorPool.query(query,[id],(err, results) => {
        if (err) {
            console.error('Error fetching tutor verify data:', err);
            res.status(500).json({ error: 'Error fetching tutor verify data' });
            return;
        }
        res.json(results);
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




app.delete('/delete-enroll-tutor/:id', (req, res) => {
    const enrollid = req.params.id; // Extract tutor ID from the URL parameter

    // SQL query to delete a tutor with a specific ID
    const deleteQuery = 'DELETE FROM enrollstudent WHERE id = ?';

    tutorPool.query(deleteQuery, [enrollid], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to delete tutor' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Tutor successfully deleted
        res.status(200).json({ message: 'Student remove successfully' });
    });
});


app.get('/tutorDetails',auth, (req, res) => {
    const id = req.user.id
    const query = 'SELECT  id,approve FROM verifytutor where tutorId = ?'; // Replace 'tutors' with your table name

    tutorPool.query(query,[id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to fetch tutor details' });
        }

        // Assuming you have the result with tutor details
        res.status(200).json(result); // Return the tutor details as JSON
    });
});


    app.post('/tutorcreatemcqs',auth,(req,res)=>{
        const {t_question,t_optA,t_optB,t_optC,t_optD,t_Correctopt,tutor_id}=req.body;
        if(!t_question || !t_optA || !t_optB || !t_optC || !t_optD || !t_Correctopt || !tutor_id){
            return res.status(400).json({error: 'All fields are required'});
        }
        const sql='INSERT INTO t_mcqs (t_question,t_optA,t_optB,t_optC,t_optD,t_correctedopt,tutor_id) VALUES (?,?,?,?,?,?,?)';
        const values=[t_question,t_optA,t_optB,t_optC,t_optD,t_Correctopt,tutor_id];
        tutorPool.query(sql,values,(err,result)=>{
            if(err){
                console.error("Error to store in database",err);
                res.status(500).json({error:"Error to store"});
                return;
            }
            res.json({message: 'Successfully store in database'});

        });
    });


    const storagee = multer.diskStorage({
        destination: async function (req, file, cb) {
            try {
                // const getEmailSql = 'SELECT tutor_email FROM tutor WHERE id = ?';
                // const [rows, fields] = await tutorPool.promise().query(getEmailSql, [req.body.tutor_id]);
                // const TutorEmail = await rows[0]?.tutor_email;
                // console.log(rows);
                const tutorEmail = req.body.tutor_email;// Get tutor's email from the request
                console.log(req.body); 
                const uploadPath = `./public/tutorcourses/${tutorEmail}`;
                // Create folder if it doesn't exist
                if (!fs.existsSync(uploadPath)) {
                    fs.mkdirSync(uploadPath, { recursive: true });
                }
                cb(null, uploadPath);
            } catch (err) {
                console.error('Error retrieving tutor email:', err);
                cb(err);
            }
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        }
    });
    


    
    const uploadd = multer({ storage: storagee });
    
    app.post('/tutorcourse',auth, uploadd.single('course'), (req, res) => {
        const { title,tutor_id,tutor_email,format} = req.body;
        const coursePath = req.file.path;
        let curse = coursePath.split(`\\`).pop()
        // Insert the video details into the database
        const sql = 'INSERT INTO tutorcourse (title, course, tutor_id, format) VALUES (?, ?, ?, ?)';
        tutorPool.query(sql, [title, curse, tutor_id,format], (err, result) => {
            if (err) {
                console.error('Error inserting video:', err);
                res.status(500).send('Error uploading video');
                return;
            }

           
            
            // Send the tutor's email along with the response
            // const tutorEmail = getEmailResult[0].tutor_email;
            res.send({mes:`Video uploaded successfully! `});
            
        });
        });
    

    app.get('/tutorcourseget/:id',auth,(req,res)=>{
      
        const id = req.params.id;
        const format = req.query.format; // Assuming you pass 'video' or 'file' as a query parameter
    
        let query = 'SELECT * FROM tutorcourse WHERE tutor_id = ?';
        const params = [id];
    
        if (format) {
            query += ' AND format = ?';
            params.push(format);
        }
    
        tutorPool.query(query, params, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Failed to show tutorcourse' });
            }
    
            //      

            // Set appropriate content type based on format
        let contentType;
        if (format === 'video') {
            contentType = 'video/mp4'; // Adjust this based on your video format
        } else if (format === 'file') {
            contentType = 'application/octet-stream'; // Adjust this based on your file type
        }

        // Set headers
        res.setHeader('Content-Disposition', 'inline');
        res.setHeader('Content-Type', contentType);

        // Send the data
        res.send(result);
        });
    });

}









