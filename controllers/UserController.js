const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const { Router } = require('express');
const sequelize = require('../db');
const User = sequelize.import('../models/User');
const { UniqueConstraintError } = require('sequelize/lib/errors');

const userController = Router();

userController.post('/test', function(req, res){
    res.send("Successful Test Run?!?")
});

//Register Route
userController.post('/register', function(req, res) {
    let username = req.body.user.username;
    let password = req.body.user.password;
    // let admin = req.body.user.admin;

    User.create({
        username: username,
        passwordhash: bcrypt.hashSync(password, 12),
        // admin: admin
    }).then(
        function createSuccess(user) {
            var token = jwt.sign({id: user.id}, process.env.JWT_SECRET,
                {expiresIn: 60*60*24});

                res.json({
                    user: user,
                    message: 'User registered',
                    sessionToken: token
                });
        },
        function createError(err) {
            if (err instanceof UniqueConstraintError) {
                res.status(409).json({
                    message: 'Username already in use.'
                });
            } else {
                res.status(500).json({
                    message: 'Failed to register user'
                });
            }
        }
    );
});  

//Login Route
userController.post('/login', function(req, res) {
    User.findOne( { where: { username: req.body.user.username }
     }).then(

        function(user) {
            if (user) {
                bcrypt.compare(req.body.user.password, user.passwordhash, function (err, matches) {
                    if (matches) {
                        var token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: 60*60*24});
                        res.json({
                            user: user,
                            message: "Perfect Login!",
                            sessionToken: token
                        });
                    }else {
                        res.status(502).send({ error: "We have a BAD GATEWAY here!!"});
                    }
                });
            } else {
                res.status(500).send({ error: "Failed to authenticate!"});
            }
        },
    function (err) {
        res.status(501).send({ error: "Sorry, NOT IMPLEMENTED here" });
    }
  );
});

//Delete Account Route
userController.delete('/delete', function (req, res) {
    User.findOne({ where: { username: req.body.user.username }
    }).then(
        function(user) {
            if (user){
                console.log(user);
                bcrypt.compare(req.body.user.password, user.passwordhash, function (err, matches){
                    if(matches){
                        User.destroy({
                            where: { username: req.body.user.username }
                        }).then (
                            function deleteAccountSuccess(data){
                                res.send("Your account has been deleted.")
                            },
                            function deleteLogError(err){
                                res.send(500, err.message);
                            }
                        )
                    }
                })
            }
        }
    )
  
});

//Admin Delete Account Function
// userController.delete('/admin/:id', (req, res) => {
//     if (req.user.admin === true) {
//         User.destroy({
//             where: { id: req.params.id }
//         })
//         .then(
//             function deleteAccountSuccess(data) {
//                 res.send("Sorry, Lord Sauron has confiscated this content!")
//             },
//             function deleteAccountError(err){
//                 res.send(500, err.message);
//             }
//         )};
// });

//Change Password Route
userController.put("/changepassword", function(req, res){
    User.findOne( { where: { username: req.body.user.username }
    }).then(
        function(user) {
            if (user) {
                bcrypt.compare(req.body.user.oldPassword, user.passwordhash, function (err, matches) {
                    if (matches) {
                        user.passwordhash = bcrypt.hashSync(req.body.user.newPassword, 12)
                        user.update(user, { fields: ['passwordhash'] }).then( () => {
                            res.status(200).send( user );
                        })
                    }else {
                        res.status(502).send({ error: "Old Password Didnt match."});
                    }
                });
            } else {
                res.status(500).send({ error: "failed to authenticate"});
            }
        },
    function (err) {
        res.status(501).send({ error: "Sorry, NOT IMPLEMENTED here" });
    }
  );
});

module.exports = userController;