const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const config = require("config");
const express = require("express");
const router = express.Router();

const {User} = require("../models/User");


router.post('/', async (req, res)=>{

    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email : req.body.email });
    if(!user) return res.status(400).send("Invalid email or password");

    const isValid = await bcrypt.compare(req.body.password, user.password);
    if(!isValid) return res.status(400).send("Invalid email or password");

    const token = user.generateAuthToken();
    res.setHeader('x-auth', token).send(token);
})

const validate = (auth) => {

    const authJoiSchema = Joi.object({
        email: Joi.string().max(255).email().required(),
        password: Joi.string().max(1024).required()
    })

    return authJoiSchema.validate(auth);
}


module.exports = router;