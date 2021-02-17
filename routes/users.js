const express = require('express');
const { Mongoose } = require('mongoose');
const bcrypt = require('bcrypt');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../models/User');

router.post('/', [
    check('name', 'name is required').not().isEmpty(),
    check('email', 'email is not valid').isEmail(),
    check('password', 'enter valid password').isLength({
        min: 6
    }),
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        // res.send('passed');
        const { name, email, password } = req.body;
        try {

            let user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({ msg: "User Already Exist" });
            }

            user = new User({
                name,
                email,
                password
            });
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            await user.save();

            const payload = {
                user: {
                    id: user.id
                }
            }

            jwt.sign(payload, config.get('jwtSecret'),
                {
                    expiresIn: 360000
                }, (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );

        } catch (err) {
            console.error(err.message);
            res.status(500).send('server Error');

        }
    });


router.get('/', (req, res) => {
    res.json({
        message: 'Testroute'
    });
});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    res.json({
        message: `your id is ${id}`
    });
});


module.exports = router;