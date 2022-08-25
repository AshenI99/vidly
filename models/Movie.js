const mongoose = require("mongoose");
const Joi = require("joi");

const { genreSchema } = require("./Genre");


const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 150,
        trim: true
    },
    genre: {
        type: genreSchema,
        required: true,
    },
    numberInStock: {
        type: Number,
        min: 0,
        default: 0
    },
    dailyRentalRate: {
        type: Number,
        min: 0,
        required: true
    }
})

const Movie = mongoose.model("Movie", movieSchema);

const validateMovie=(movie)=>{

    const movieJoiSchema = Joi.object({
        title: Joi.string()
            .min(5)
            .max(50)
            .required(),

        genreId: Joi.string()
            .required(),

        numberInStock: Joi.number()
            .default(0)
            .min(0),

        dailyRentalRate: Joi.number()
            .min(0)
            .required()
    })

    return movieJoiSchema.validate(movie);
}

exports.Movie = Movie;
exports.validate = validateMovie;