const express = require ('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const User = require('../../models/User')
const jwt = require('jsonwebtoken')
const config = require('config')
const bcrypt = require('bcryptjs')
const { body, validationResult } = require("express-validator");


//@route    GET api/auth
//@desc     Test Route
//@access   Public
router.get('/', auth,  async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        res.json(user)
    } catch (err) {
        console.error(err.message)
        res.status(500).send("Server Error")
    }
})

//@route    Post api/auth
//@desc     Authenticate user & get token
//@access   Public
router.post("/",
    [
        body('email').isEmail(),
        body('password').not().isEmpty()
    ], 
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            console.log(errors.array())
            return res.status(400).json({errors: errors.array()})
        }
        //See if the user exists
        //Get User's gravatar
        //Encrypt password
        //Return json web token

        const { email, password } = req.body
        console.log(req.body)
        console.log(req.body.email)
        console.log(req.body.password)
        console.log("Trying to log in")
        console.log(email)

        try {
            //Grab the user from the db 
            let user = await User.findOne({ email })
            
            if(!user){
                return res.status(400).json({error: [{msg: 'No user found'}]})
            }

            //Check to see if the imputted password matches the hashed password
            const match = await bcrypt.compare(password, user.password)
            console.log("Checking password match")
            console.log(match)

            if(!match) {
                return res.status(400).json({error: [{msg: 'No user found'}]})
            }

            const payload = {
                user: {
                    id: user.id
                }
            }

            
            jwt.sign(
                payload, 
                config.get('jwtToken'),
                { expiresIn: 360000 }, 
                (err, token) => {
                    if(err) throw err
                    res.json({ token })
                }
                )
                
            } catch (err) {
            console.log(err)
            res.status(500).send('server error')
        }

    });

module.exports = router