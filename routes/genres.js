const express = require("express");
const router = express.Router();

const { Genre, validate } = require("../models/Genre");

router.get('/', async (req, res)=>{
    try {
        const genres = await Genre.find().sort("name");
        res.send(genres);
    } catch (e) {
        res.send(e.message);
    }
})

router.post('/', async (req, res)=>{
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const newGenre = new Genre({
        name: req.body.name
    })

    try{
        const savedGenre = await newGenre.save();
        res.send(savedGenre);
    } catch (e) {
        res.send(e.message);
    }
})

router.put('/:id', async (req, res)=>{
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    try{
        const savedGenre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });

        if(!savedGenre) return res.status(404).send("The genre with the given id is not found")

        res.send(savedGenre);
    } catch (e) {
        res.send(e.message);
    }
})

router.delete('/:id', async (req, res)=>{
    try{
        const deletedGenre = await Genre.findByIdAndRemove(req.params.id);

        if(!deletedGenre) return res.status(404).send("The genre with the given id is not found")

        res.send(deletedGenre);
    } catch (e) {
        res.send(e.message);
    }
})

router.get('/:id', async (req, res)=>{
    try{
        const genre = await Genre.findById(req.params.id);

        if(!genre) return res.status(404).send("The genre with the given id is not found")

        res.send(genre);
    } catch (e) {
        res.send(e.message);
    }
})

module.exports = router;