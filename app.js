const mongoose = require("mongoose");
const express = require("express");
const Joi = require("joi");

Joi.objectId = require("joi-objectid")(Joi);

const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const users = require("./routes/users");

const app = express();

mongoose.connect('mongodb://localhost/vidly', null, (err)=>{
    if(err) console.error("Could not connect to MongoDB ", err.message);
    else console.log("Connected to MongoDB")
})

app.use(express.json());

app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/users", users);

const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log(`Listening on port ${port}...`))