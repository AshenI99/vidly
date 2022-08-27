const express = require("express");
const router = express.Router();

const { Customer, validate } = require("../models/Customer")

router.get('/', async (req, res) => {
    try {
        const customers = await Customer.find().sort("name");
        res.send(customers);
    } catch (e) {
        res.send(e.message)
    }
})

router.post('/', async (req, res) => {

    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message)

    const savingCustomer = new Customer({
        name: req.body.name,
        mobile: req.body.mobile,
        isGold: req.body.isGold,
    })

    try {
        await savingCustomer.save();
        res.send(savingCustomer);
    } catch (e) {
        res.send(e.message)
    }
})

router.put('/:id', async (req, res)=>{

    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message)

    const savingCustomer = {
        name: req.body.name,
        mobile: req.body.mobile,
        isGold: req.body.isGold
    }

    try {
        const savedCustomer = await Customer.findByIdAndUpdate(req.params.id, savingCustomer, { new: true });

        if(!savedCustomer) res.status(404).send("The customer with the given id is not found")

        res.send(savedCustomer);
    } catch (e) {
        res.send(e.message)
    }
})

router.delete('/:id', async (req, res)=>{
    try {
        const deletedCustomer = await Customer.findByIdAndRemove(req.params.id);

        if(!deletedCustomer) res.status(404).send("The customer with the given id is not found")

        res.send(deletedCustomer);
    } catch (e) {
        res.send(e.message)
    }
})

router.get('/:id', async(req, res)=>{
    try {
        const customer = await Customer.findById(req.params.id);

        if(!customer) res.status(404).send("The customer with the given id is not found")

        res.send(customer);
    } catch (e) {
        res.send(e.message)
    }
})

module.exports = router;