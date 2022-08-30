const Joi = require("joi");
const express = require("express");
const router = express.Router();

const {Rental} = require("../models/Rental");
const {Movie} = require("../models/Movie");

const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const mongoose = require("mongoose");

const validateReturn=(returns)=>{
    const returnsJoiSchema = Joi.object({
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    })

    return returnsJoiSchema.validate(returns);
}

router.post('/', [auth, validate(validateReturn)], async (req, res)=>{

    const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

    if(!rental) return res.status(404).send("Rental not found");
    if(rental.dateReturned) return res.status(400).send("Return is already processed");

    rental.return();

    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
        await rental.save();
        await Movie.findByIdAndUpdate(req.body.movieId, {
            $inc: { numberInStock: 1 }
        })

        res.send(rental);
    })
    session.endSession();
});

module.exports = router;