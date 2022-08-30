const config = require("config");
const winston = require("winston");
require("winston-mongodb");
require("express-async-errors");

module.exports = function () {

    winston.add(new winston.transports.MongoDB({ db: config.get('db'), level: "info" }));
    winston.add(new winston.transports.File({ filename: 'logs/example.log' }));
    winston.add(
        new winston.transports.Console(
            {
                format: winston.format.combine(
                    winston.format.colorize(),
                    winston.format.prettyPrint()
                )
            }
        )
    );

    winston.exceptions.handle(new winston.transports.File({
        filename: 'logs/exceptions.log'
    }))

    process.on('unhandledRejection', (ex)=>{
        throw ex;
    })

    // winston.rejections.handle(new winston.transports.File({
    //     filename: 'logs/exceptions.log'
    // }))
}