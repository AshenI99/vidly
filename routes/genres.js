const _ = require("lodash");
const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");
const validateObjectId = require("../middlewares/validateObjectId");

const { Genre, validate } = require("../models/Genre");

router.get('/', async (req, res)=>{
    const genres = await Genre.find().sort("name");
    res.send(genres);
});

router.post('/', auth, async (req, res)=>{
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const newGenre = new Genre(_.pick(req.body, ["name"]));
    await newGenre.save();

    res.send(newGenre);
});

router.put('/:id', [auth, validateObjectId], async (req, res)=>{
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const savedGenre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
    if(!savedGenre) return res.status(404).send("The genre with the given id is not found")

    res.send(savedGenre);
});

router.delete('/:id', [auth, admin, validateObjectId], async (req, res)=>{
    const deletedGenre = await Genre.findByIdAndRemove(req.params.id);
    if(!deletedGenre) return res.status(404).send("The genre with the given id is not found")

    res.send(deletedGenre);
});

router.get('/:id', validateObjectId, async (req, res)=>{
    const genre = await Genre.findById(req.params.id);
    if(!genre) return res.status(404).send("The genre with the given id is not found")

    res.send(genre);
});

module.exports = router;