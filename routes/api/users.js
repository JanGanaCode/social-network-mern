const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

// Load user model
const User = require('./../../models/User');

// @route     GET api/users/test
// @desc      Tests post route
// @access    Public
router.get('/test', (req, res) => res.json({msg: "Users works"}));

// @route     GET api/users/register
// @desc      Register a user
// @access    Public
router.post('/register', (req, res) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      // check if user already registered with email
      if (user){
        return res.status(400).json({ email: "Email already exists"})
      } else {
        // create user
        const avatar = gravatar.url(req.body.email, {
          // size
          s: '200',
          // rating
          r: 'pg',
          // default
          d: 'mm'
        });

        const newUser = new User({
          name: req.body.name,
          form: req.body.email,
          avatar: avatar,
          password: req.body.password,
        });

        // encrypt password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;
            newUser.password = hash;
            newUser.save()
            .then(user => res.json(user))
            .catch(err => console.log(err))
          })
        });
      }
    })
});

module.exports = router;
