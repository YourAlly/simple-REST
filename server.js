const express = require('express');
const mongoose = require('mongoose');

const PORT = 3000;
app = express();


// Connect to the databse
mongoose.connect('mongodb://localhost:27017/api',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connected To Database');
});


// Creates the user Model
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: [1, 'Must at least contain a character!'],
        maxlength: [32, 'Must not exceed 32 characters!']
    },
    password: {
        type: String,
        required: true,
        minlength: [1, 'Must at least contain a character!'],
        maxlength: [32, 'Must not exceed 32 characters!']
    },
    disabled: {
        type: Boolean,
        required: true
    }
})

const User = new mongoose.model('User', userSchema);


// Users route
app.route('/users')
    .get((req, res)=>{})
    .post((req, res) => { })
    .put((req, res) => { })
    .delete((req, res) => { });

app.listen(PORT, ()=> console.log('Server Started'));
