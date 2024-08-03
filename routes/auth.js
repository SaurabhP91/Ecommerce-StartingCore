const router = require('express').Router();
//const {registerUser, loginUser} = require('../controllers/authController');
const User = require('../models/User');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

const secret = 'asdfe45we45w345wegw345werjktjwertkj';


router.post('/register', async (req,res) => {
    try{
        
        const { name, email, password } = req.body;
        //check if user exists
        const checkUser = await User.findOne({email});
        if(checkUser)
        {
            return res.status(400).send('Email already exists');
        }
        //generate new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //create a new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        })

        //save user
        const user = await newUser.save();
        res.status(200).json(user);

    }catch (error) {
        res.status(500).json(error);
    }
});

router.post('/login', async (req,res) => {
    try{
        const {email, password} = req.body;
        //check if email exists
        const checkUser = await User.findOne({email});
        if(!checkUser)
        {
            res.status(400).send('Email is not registered');
        }

        //password validation
        const validPass = await bcrypt.compare(password,checkUser.password);
        if(!validPass)
        {
            return res.status(400).send('Invalid password')
        }

        jwt.sign({ name: checkUser.name, id: checkUser._id}, secret, {expiresIn: '1h'}, (err,token) => {
            if(err) throw err;

            res.cookie('token', token, { httpOnly: true}).json({
                id: checkUser._id,
                name: checkUser.name,
            });
        });

        res.status(200).json(checkUser);
    } catch(error) {
        res.status(500).json(error);
    }
});

module.exports = router;