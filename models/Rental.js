const mongoose = require("mongoose");
const Joi = require("joi");

const {rentalCustomerSchema} = require("./Customer");
const {rentalMovieSchema} = require("./Movie");

const rentalSchema = new mongoose.Schema({
    customer: {
        type: rentalCustomerSchema,
        required: true
    },
    movie: {
        type: rentalMovieSchema,
        required: true
    },
    dateOut: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateReturned: {
        type: Date
    },
    rentalFee: {
        type: Number,
        min: 0
    }
})

const Rental = mongoose.model("Rental", rentalSchema);

const validateRental=(rental)=>{

    const rentalJoiSchema = Joi.object({
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    })

    return rentalJoiSchema.validate(rental);
}

exports.Rental = Rental;
exports.validate = validateRental;