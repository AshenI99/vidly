const _ = require("lodash");
const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");
const validateObjectId = require("../middlewares/validateObjectId");

const { Customer, validate } = require("../models/Customer")

router.get('/', auth , async(req, res) => {
    const customers = await Customer.find().sort("name");
    res.send(customers);
});

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message)

    const savingCustomer = new Customer(_.pick(req.body, ["name", "mobile", "isGold"]))
    await savingCustomer.save();

    res.send(savingCustomer);
});

router.put('/:id', [auth, validateObjectId], async (req, res)=>{
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message)

    const savingCustomer = _.pick(req.body, ["name", "mobile", "isGold"]);

    const savedCustomer = await Customer.findByIdAndUpdate(req.params.id, savingCustomer, { new: true });
    if(!savedCustomer) res.status(404).send("The customer with the given id is not found")

    res.send(savedCustomer);
});

router.delete('/:id', [auth, admin, validateObjectId] , async(req, res)=>{
    const deletedCustomer = await Customer.findByIdAndRemove(req.params.id);
    if(!deletedCustomer) res.status(404).send("The customer with the given id is not found")

    res.send(deletedCustomer);
});

router.get('/:id', [auth, validateObjectId], async(req, res)=>{
    const customer = await Customer.findById(req.params.id);
    if(!customer) res.status(404).send("The customer with the given id is not found")

    res.send(customer);
});

module.exports = router;