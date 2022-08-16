const mongoose = require("mongoose");
const express = require("express");

const genres = require("./routes/genres");
const customers = require("./routes/customers");

const app = express();

mongoose.connect('mongodb://localhost/vidly', null, (err)=>{
    if(err) console.error("Could not connect to MongoDB ", err.message);
    else console.log("Connected to MongoDB")
})

app.use(express.json());

app.use("/api/genres", genres);
app.use("/api/customers", customers);

const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log(`Listening on port ${port}...`))