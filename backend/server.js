//* We could use all .env variables 
require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');

const cors = require('cors');


//* Connect our database
mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;

//? If error is returned
db.on('error', (error) => console.error(error));

//? If server is connected
db.once('open', () => console.log('Connected to Database'));

//* Let our database accept JSON files
app.use(express.json());

app.use(cors());

const authorsRoutes = require('./routes/authorsRoutes');
app.use('/authors', authorsRoutes);

const postsRoutes = require("./routes/postsRoutes");
app.use('/blogPosts', postsRoutes);

const resourceRoutes = require('./routes/resourcesRoutes');
app.use('/resources', resourceRoutes);

const commentsRoute = require('./routes/commentsRoute');
app.use('/', commentsRoute);


app.listen(port = 3000, () => console.log(`Server Started at port ${port}`));