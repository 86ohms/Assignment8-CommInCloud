// Use .env database
// require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/thermocouple', 
    { 
        useNewUrlParser: true // non-depricated parser
    });

const db = mongoose.connection;
db.on('error', (error) => console.error(error)); // error check
db.once('open', (error) => console.log('Connected to Mongo Database')) // no errors, connect to database

app.use(express.json()) // use JSON

const thermocoupleRouter = require('./routes/thermocouple')
app.use('/thermocouple', thermocoupleRouter) // use for every data query

app.listen(3000, () => {
    console.log('Server Started on port 3000') // run on port 3000
});