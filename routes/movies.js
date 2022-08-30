const _ = require("lodash");
const express= require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");
const validateObjectId = require("../middlewares/validateObjectId");

const { Movie, validate } = require("../models/Movie")
const { Genre } = require("../models/Genre");

router.get('/', async (req, res)=>{
    const movies = await Movie.find().sort("title");
    res.send(movies);

});

router.post('/', auth, async (req, res)=>{
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if(!genre) return res.status(404).send("Invalid genre...")

    const savingMovie = new Movie({
            ..._.pick(req.body, ["title", "numberInStock", "dailyRentalRate"]),
            genre: _.pick(genre, ["_id", "name"])
        })
    await savingMovie.save();

    res.send(savingMovie);
});

router.put('/:id', [auth, validateObjectId], async (req, res)=>{
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if(!genre) return res.status(404).send("Invalid genre...")

    const savingMovie = {
        ..._.pick(req.body, ["title", "numberInStock", "dailyRentalRate"]),
        genre: _.pick(genre, ["_id", "name"])
    };

    const savedMovie = await Movie.findByIdAndUpdate(req.params.id, savingMovie, { new: true });
    if(!savedMovie) return res.status(404).send("The movie with the given id is not found");

    res.send(savedMovie);
});

router.delete('/:id', [auth, admin, validateObjectId], async (req, res)=>{
    const deletedMovie = await Movie.findByIdAndRemove(req.params.id);
    if(!deletedMovie) return res.status(404).send("The movie with the given id is not found");

    res.send(deletedMovie);
});

router.get('/:id', validateObjectId, async (req, res)=>{
    const movie = await Movie.findById(req.params.id);
    if(!movie) return res.status(404).send("The movie with the given id is not found");

    res.send(movie);
});

module.exports = router;