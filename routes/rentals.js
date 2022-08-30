const _ = require("lodash");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const validateObjectId = require("../middlewares/validateObjectId");

const { Rental, validate } = require("../models/Rental");
const { Customer } = require("../models/Customer");
const { Movie } = require("../models/Movie");

router.get('/', auth, async (req, res)=>{
    const rentals = await Rental.find().sort("-dateOut");
    res.send(rentals);
});

router.post('/', auth, async (req, res)=>{

    const { error } = validate(req.body);
    if(error) return  res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if(!customer) return res.status(400).send("Invalid customer");

    const movie = await Movie.findById(req.body.movieId);
    if(!movie) return res.status(400).send("Invalid movie");

    if(movie.numberInStock === 0) return res.status(400).send("Movie is not in stock");

    let rental = new Rental({
        customer: _.pick(customer, ["_id", "name", "mobile", "isGold"]),
        movie: _.pick(movie, ["_id", "title", "dailyRentalRate"])
    })

    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
        await rental.save();

        movie.numberInStock--;
        await movie.save();

        res.send(rental);
    })
    session.endSession();
});

// router.put('/:id', async (req, res) => {
//
//     const { error } = validate(req.body);
//     if(error) return  res.status(400).send(error.details[0].message);
//
//     const customer = await Customer.findById(req.body.customerId);
//     if(!customer) return res.status(400).send("Invalid customer");
//
//     const movie = await Movie.findById(req.body.movieId);
//     if(!movie) return res.status(400).send("Invalid movie");
//
//
// })

router.delete('/:id', [auth, validateObjectId], async (req, res)=>{
    const rental = await Rental.findById(req.params.id);
    if(!rental) return res.status(400).send("Invalid rental");

    const movie = await Movie.findById(rental.movie._id);

    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
        const deletedRental = await Rental.findByIdAndRemove(req.params.id);

        if (movie) {
            movie.numberInStock++;
            await movie.save();
        }
        res.send(deletedRental);
    })
    session.endSession();
});

router.get('/:id', [auth, validateObjectId], async (req, res) => {
    const rental = await Rental.findById(req.params.id);
    if(!rental) return res.status(404).send("Rental with the given id is not found");

    res.send(rental);
});

module.exports = router;