const mongoose = require("mongoose");
const Joi = require("joi");

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 50
    }
})

const Genre = mongoose.model("Genre", genreSchema);

const validateGenre=(genre)=>{
    const genreJoiSchema = Joi.object({
        name: Joi.string()
            .min(5)
            .max(50)
            .required()
    })

    return genreJoiSchema.validate(genre);
}


exports.Genre = Genre;
exports.validate = validateGenre;
exports.genreSchema = genreSchema;