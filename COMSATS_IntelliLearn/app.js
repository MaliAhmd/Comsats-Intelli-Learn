const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const crypto = require('crypto'); // Import the crypto module
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const tutor_server = require('./tutor-server')
const admin_server=require('./admin-server')

const jwt=require('jsonwebtoken')
const auth=require('./Middleware/auth')
const cors=require("cors")
const cloudinary=require('cloudinary')
const app = express();
const port = 5000;

const corsOptions = {
    origin:['http://localhost:5000'], 
    credentials:true,        
    optionSuccessStatus:200,
    methods:["GET","POST","PUT","DELETE"]
}
app.use(cors({
    origin:'http://localhost:5000'
}));

app.use(express.static('public'));
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
  });


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json())
app.use(cookieParser())
app.use(cors(corsOptions))
app.use(express.json({limit:'50mb'}))
app.use(express.urlencoded({limit:'50mb', extended:true }))

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
        //   res.redirect('/public/student/s_index.html')
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
      let token
      try {
          // Compare the entered password with the stored hash
          const passwordMatch = await bcrypt.compare(password, hashedPassword);

          if (passwordMatch) {
              console.log('User logged in successfully');
              // Set a cookie upon successful login
              console.log({id:user.id,reg:regno})
              token= await jwt.sign(
                {id:user.id,reg:regno},
                "Comsats_Intelli-learn",
                {expiresIn: '24 h'}
              )
              res.status(200).json({result,token})
          } else {
              res.status(401).json({ error: 'Invalid credentials' });
          }
      } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Login failed' });
      }
  });
});

// const secretKey = crypto.randomBytes(64).toString('hex');
// console.log('Generated Secret Key:', secretKey); // Log the generated key (for debugging)


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
                res.redirect('/public/student/Frontend/s_index.html'); // You can replace '/login' with the actual login page URL
            }
        });
    } else {
        // If there is no session, consider the user as already logged out
        res.redirect('/public/student/Frontend/s_index.html'); // You can replace '/login' with the actual login page URL
    }
});

app.get('/show-tutors-details', (req, res) => {
    const query = "SELECT tutor.id, tutor.tutor_name, tutor.tutor_subject, tutor.tutor_email,verifytutor.t_image FROM tutor LEFT JOIN verifytutor ON verifytutor.tutorId = tutor.id"; // Replace 'tutors' with your table name

    pool.query(query, (err, result) => {
        if (err) {  
            console.error(err);
            return res.status(500).json({ error: 'Failed to fetch tutor details' });
        }

        // Assuming you have the result with tutor details
        res.status(200).json(result); // Return the tutor details as JSON
    });
});
// cloudinary.config({ 
//     cloud_name: 'dqlbidkyx', 
//     api_key: '977157985658271', 
//     api_secret: 'g6tlACzfjxP1SUKvRuiA6d8bdgw' 
//   });
app.post('/studentdata',auth,async (req, res) => {
    const { student_name, student_regno, student_email,tutor_id } = req.body;
    const id = req.user.id
    try {
        // Store the hashed password in the database
        const sql = 'INSERT INTO enrollstudent (student_name, student_regno, student_email,tutor_id,user_id) VALUES (?,?,?,?,?)';
        const values = [student_name, student_regno, student_email, tutor_id,id];

        pool.query(sql, values, (err, result) => {
            if (result) {
                console.log('Student data save successfully');
                return res.status(201).json({ message: 'Studentdata store successfully' });
            }else{
                console.error(err);
                return res.status(500).json({ error: 'Studentdata failed to store' });
            }
            
            // res.redirect('/public/tutor/t_index.html');
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'failed' });
    }
});
app.get('/show-student-details/:id', (req, res) => {
    const id=req.params.id;
    const query = 'SELECT id, CONCAT(firstname," ",lastname) AS Student_name ,regno ,email FROM users where id=?';

    pool.query(query,[id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to fetch tutor details' });
        }

        // Assuming you have the result with tutor details
        res.status(200).json(result); // Return the tutor details as JSON
    });
});

app.get('/showselectedtutor/:id',auth, (req, res) => {
    const id = req.params.id;
    const query = 'SELECT t.id,t.tutor_name,t.tutor_email,t.tutor_subject FROM tutor AS t LEFT JOIN enrollstudent AS es ON  t.id = es.tutor_id WHERE es.user_id = ?';

    pool.query(query,[id], (err, result) => {   
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to show student to tutor' });
        }

        // Assuming you have the result with tutor details
        res.status(200).json(result); // Return the tutor details as JSON
    });
});

app.get('/getquizcategory', auth ,(req,res)=>{
    const query='SELECT category,id from category';
    pool.query(query,(err,result)=>{
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to show category' });
        }

        // Assuming you have the result
        res.status(200).json(result); 
    })
});

// app.get('/t_getquizcategory', auth ,(req,res)=>{
//     const query='SELECT t_category,id,tutor_id from t_category';
//     pool.query(query,(err,result)=>{
//         if (err) {
//             console.error(err);
//             return res.status(500).json({ error: 'Failed to show category' });
//         }

//         // Assuming you have the result
//         res.status(200).json(result); 
//     })
// });

app.get('/getmcqs/:id',auth,(req,res)=>{
    const cat_id=req.params.id
    const query='select * from mcqs where category_id=?';
    pool.query(query,[cat_id],(err,result)=>{
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to show mcqs' });
        }

        // Assuming you have the result
        res.status(200).json(result); 
    })
})

app.get('/tutorgetmcqs/:id',auth,(req,res)=>{
    const tutor_id=req.params.id
    const query='select * from t_mcqs where tutor_id=?';
    pool.query(query,[tutor_id],(err,result)=>{
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to show mcqs' });
        }

        // Assuming you have the result
        res.status(200).json(result); 
    })
})


app.post('/marking',auth,(req,res)=>{
    const {	selectedOpt, score,mcqs_id,category_id}=req.body;
    const id = req.user.id
    try{
        const sql='INSERT INTO mcqschecker (selectedOpt, score ,user_id,mcqs_id,category_id) values (?,?,?,?,?)';
        const values=[selectedOpt, score,id,mcqs_id,category_id];

        pool.query(sql,values,(err,result)=>{
            if (result) {
                console.log('Check successfully');
                return res.status(201).json({ message: 'successfully' });
            }else{
                console.error(err);
                return res.status(500).json({ error: 'failed' });
            }
            
        });
    }catch (error) {
            console.error(error);
            res.status(500).json({ error: 'failedddd' });
    }
    
});



app.listen(port, () => console.log(`Listening on port ${port}`));
module.exports = {pool}