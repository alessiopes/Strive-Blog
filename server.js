//* We could use all .env variables 
require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');


//* Connect our database
mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;

//? If error is returned
db.on('error', (error) => console.error(error));

//? If server is connected
db.once('open', () => console.log('Connected to Database'));

//* Let our database accept JSON files
app.use(express.json());

const databaseRouter = require('./routes/database');
app.use('/database', databaseRouter);



app.listen(port = 5050, () => console.log(`Server Started at port ${port}`));