const express = require('express');
const mongoose = require('mongoose');

const PORT = 3000;
app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());
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
    disabled: {
        type: Boolean,
        required: true
    }
})

const User = new mongoose.model('User', userSchema);


// Users route
app.route('/users')

    // Gets all or certain users where username === req.query.name
    // and disabled === req.query.disabled
    .get((req, res)=>{
        const disabled = req.query.disabled ?
                            req.query.disabled.toLowerCase() === 'true'? true : false 
                        : false;

        if (req.query.all === 'true'){
            User.find((err, foundUsers) => {
                if (!err) {
                    res.json(foundUsers);
                } else {
                    res.json(err);
                }
            });

        } else if (req.query.username){
            User.find({
                username: req.query.username, 
                disabled: disabled
                },
                (err, foundUsers)=>{
                    if (!err){
                        res.json(foundUsers);
                        
                    } else {
                        res.json(err);
                    }
            });

        } else {
            User.find({
                disabled: disabled
            },
                (err, foundUsers) => {
                    if (!err) {
                        res.json(foundUsers);

                    } else {
                        res.json(err);
                    }
                });
        } 
    })
    .post((req, res) => {
        const newUser = new User({
            username: req.body.username,
            disabled: false
        });
        newUser.save(function (err) {
            if (!err) {
                res.send("Successfully added a new User.");
            } else {
                res.send(err);
            }
        });
    })

    // Updates all users
    .put((req, res)=> {
        const ok = req.body.disabled.toLowerCase() === 'true' || req.body.disabled.toLowerCase() === 'false';
        
        if (ok) {
            const disabled = req.body.disabled.toLowerCase() === 'true' ? true : false
            User.updateMany({}, { $set: { disabled: disabled } },
                function (err) {
                    if (!err) {
                        res.send("Successfully updated the Users");
                    }
                }
            );
        }
        else {
            res.send("Please provide a value for disabled")
        }
    });

app.route('/user/:username')
    
    // Updates a User
    .put((req, res) => {
        const ok = req.body.disabled.toLowerCase() === 'true' || req.body.disabled.toLowerCase() === 'false';
        if (ok) {
        const disabled = req.body.disabled.toLowerCase() === 'true' ? true : false
        User.update(
            { username: req.params.username},
            { $set: {disabled: disabled}},
            function (err) {
                if (!err) {
                    res.send("Successfully updated the User");
                }
            }
        );
        }
        else{
            res.send("Please provide a value for disabled")
        }
    })

    // Deletes a User
    .delete((req, res) => {
        User.deleteOne(
            { username: req.params.username },
            function (err) {
                if (!err) {
                    res.send("Successfully deleted the User.");
                } else {
                    res.send(err);
                }
            }
        );
    });

app.listen(PORT, ()=> console.log('Server Started'));
