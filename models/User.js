const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const config = require("config");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        maxLength: 100
    },
    email: {
        type: String,
        unique: true,
        maxLength: 255,
        minLength: 5
    },
    password: {
        type: String,
        minLength: 8,
        maxLength: 1024
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(_.pick(this, ["_id", "name", "isAdmin"]), config.get("jwtPrivateKey"));
    return token;
}

const User = mongoose.model("User", userSchema);

const validateUser = (user) => {

    const userJoiSchema = Joi.object({
        name: Joi.string()
            .required()
            .min(3)
            .max(100),

        email: Joi.string()
            .min(5)
            .max(255)
            .email()
            .required(),

        password: Joi.string()
            .min(8)
            .max(1024)
            .required()
    })

    return userJoiSchema.validate(user);
}

exports.User = User;
exports.validate = validateUser;