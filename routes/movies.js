const express= require("express");
const router = express.Router();

const { Movie, validate } = require("../models/Movie")
const { Genre } = require("../models/Genre");

router.get('/', async (req, res)=>{
    try{
        const movies = await Movie.find().sort("title");
        res.send(movies);
    } catch (e) {
        res.send(e.message);
    }
})

router.post('/', async (req, res)=>{

    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if(!genre) return res.status(404).send("Invalid genre...")

    const savingMovie = new Movie({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    })

    try {
        const savedMovie = await savingMovie.save();
        res.send(savedMovie);
    } catch (e) {
        res.send(e.message);
    }
})

router.put('/:id', async (req, res)=>{

    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if(!genre) return res.status(404).send("Invalid genre...")

    const savingMovie = {
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    };

    try {
        const savedMovie = await Movie.findByIdAndUpdate(req.params.id, savingMovie, { new: true });

        if(!savedMovie) return res.status(404).send("The movie with the given id is not found");

        res.send(savedMovie);
    } catch (e) {
        res.send(e.message);
    }
});

router.delete('/:id', async (req, res)=>{

    try {
        const deletedMovie = await Movie.findByIdAndRemove(req.params.id);

        if(!deletedMovie) return res.status(404).send("The movie with the given id is not found");

        res.send(deletedMovie);
    } catch (e) {
        res.send(e.message);
    }
});

router.get('/:id', async (req, res)=>{

    try {
        const movie = await Movie.findById(req.params.id);

        if(!movie) return res.status(404).send("The movie with the given id is not found");

        res.send(movie);
    } catch (e) {
        res.send(e.message);
    }
});

module.exports = router;