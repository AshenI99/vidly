const mongoose = require("mongoose");
const Joi = require("joi");

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
    }
});

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