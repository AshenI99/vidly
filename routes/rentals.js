const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

const { Rental, validate } = require("../models/Rental");
const { Customer } = require("../models/Customer");
const { Movie } = require("../models/Movie");

router.get('/', async (req, res)=>{
    try {
        const rentals = await Rental.find().sort("-dateOut");
        res.send(rentals);
    } catch (e) {
        res.send(e.message);
    }
})

router.post('/', async (req, res)=>{

    const { error } = validate(req.body);
    if(error) return  res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if(!customer) return res.status(400).send("Invalid customer");

    const movie = await Movie.findById(req.body.movieId);
    if(!movie) return res.status(400).send("Invalid movie");

    if(movie.numberInStock === 0) return res.status(400).send("Movie is not in stock");

    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            mobile: customer.mobile,
            isGold: customer.isGold
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    })

    try {
        const session = await mongoose.startSession();
        await session.withTransaction(async () => {
            await rental.save();

            movie.numberInStock--;
            await movie.save();

            res.send(rental);
        })
        session.endSession();
    } catch (e) {
        res.send(e.message);
    }
})

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

router.delete('/:id', async (req, res)=>{

    const rental = await Rental.findById(req.params.id);
    if(!rental) return res.status(400).send("Invalid rental");

    const movie = await Movie.findById(rental.movie._id);

    try {
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
    } catch (e) {
        res.send(e.message);
    }
})

router.get('/:id', async (req, res) => {
    try {
        const rental = await Rental.findById(req.params.id);

        if(!rental) return res.status(404).send("Rental with the given id is not found");

        res.send(rental);

    } catch (e) {
        res.send(e.message);
    }
})

module.exports = router;