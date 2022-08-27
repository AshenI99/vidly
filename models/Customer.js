const mongoose = require("mongoose");
const Joi = require("joi");

const customerSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxLength:50,
        minLength:5
    },
    mobile: {
        type: String,
        required: true,
        minLength: 10,
        maxLength: 20
    },
    isGold: {
        type: Boolean,
        default: false
    }
})

const rentalCustomerSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxLength:50,
        minLength:5
    },
    mobile: {
        type: String,
        required: true,
        minLength: 10,
        maxLength: 20
    },
    isGold: {
        type: Boolean,
        default: false
    }
})

const Customer = mongoose.model("Customer", customerSchema);

const validateCustomer = (customer) => {

    const customerJoiSchema = Joi.object({
        name: Joi.string()
            .max(50)
            .min(5)
            .required(),
        mobile: Joi.string()
            .min(10)
            .max(20)
            .required(),
        isGold: Joi.boolean()
            .default(false)
    })

    return customerJoiSchema.validate(customer);
}

exports.Customer = Customer;
exports.rentalCustomerSchema = rentalCustomerSchema;
exports.validate = validateCustomer;