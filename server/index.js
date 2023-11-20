const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');

const app = express();
const port = 3001;
const upload = multer(); // Initialize multer

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Eng@ineer123',
  database: 'milala',
});

db.connect((err) => {
    if (err) {
      console.error('Database connection failed: ' + err.stack);
      return;
    }
    console.log('Connected to database');
  });
app.post('/projects', upload.single('logo'), (req, res) => {
  const { name, email, sector, stage, description, address } = req.body;
  const logo = req.file ? req.file.buffer : null;

  const sql =
    'INSERT INTO projects (name, email, sector, stage, logo, description, address) VALUES (?, ?, ?, ?, ?, ?, ?)';
  const values = [name, email, sector, stage, logo, description, address];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error inserting into database: ' + err.message);
      res.status(500).send('Internal Server Error');
      return;
    }

    console.log('Data inserted into database');
    res.status(200).send('OK');
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});