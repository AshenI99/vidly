const request = require("supertest");
const mongoose = require("mongoose");
const moment = require("moment");

const {Movie} = require("../../models/Movie");
const {Rental} = require("../../models/Rental");
const {User} = require("../../models/User");

describe("/api/returns" ,() => {
    let server;
    let customerId;
    let movieId;
    let rental;
    let movie;
    let token;

    beforeEach(async () => {
        server = require("../../app");

        token = new User().generateAuthToken();

        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();

        movie = new Movie({
            _id: movieId,
            title: '12345',
            dailyRentalRate: 200,
            numberInStock: 10,
            genre: { name: "genre1" }
        })

        await movie.save();

        rental = new Rental({
            customer: {
                _id: customerId,
                name: "12345",
                mobile: "1234567890"
            },
            movie: {
                _id: movieId,
                title: "title",
                dailyRentalRate: 200
            }
        })

        await rental.save();
    })
    afterEach(async () => {
        await server.close();
        await Rental.deleteMany({});
        await Movie.deleteMany({});
    });

    const exec = async () => {
        return await request(server)
            .post('/api/returns')
            .set("x-auth", token)
            .send({ customerId, movieId })
    }

    it("Should return 401 if the client is not logged in", async () => {
        token = '';
        const res = await exec();

        expect(res.status).toBe(401);
    })

    it("Should return 400 if the customerId is not provided", async () => {
        customerId = '';
        const res = await exec();

        expect(res.status).toBe(400);
    })

    it("Should return 400 if the movieId is not provided", async () => {
        movieId = '';
        const res = await exec();

        expect(res.status).toBe(400);
    })

    it("Should return 404 if no rental found for the customer/movie", async () => {
        await Rental.deleteMany({});
        const res = await exec();

        expect(res.status).toBe(404);
    })

    it("Should return 400 if rental is already processed", async () => {
        rental.dateReturned = new Date();
        await rental.save();
        const res = await exec();

        expect(res.status).toBe(400);
    })

    it("Should return 200 if it is a valid request", async () => {
        const res = await exec();

        expect(res.status).toBe(200);
    })

    it("Should set the returnDate if it is a valid request", async () => {
        await exec();
        const rentalInDB = await Rental.findById(rental._id);

        const diff = new Date() - rentalInDB.dateReturned;

        expect(diff).toBeLessThan(10 * 1000);
    })

    it("Should set the rentalFee if it is a valid request", async () => {
        rental.dateOut = moment().add(-7, 'days').toDate();
        await rental.save();

        await exec();

        const rentalInDB = await Rental.findById(rental._id);
        const rentalFee = rental.movie.dailyRentalRate * moment().diff(rentalInDB.dateOut, 'days');

        expect(rentalInDB.rentalFee).toBe(rentalFee);
    })

    it("Should increase movie stock if it is a valid request", async () => {
        await exec();

        const movieInDB = await Movie.findById(movieId);

        expect(movieInDB.numberInStock).toBe(movie.numberInStock + 1);
    })

    it("Should return rental if it is a valid request", async () => {
        let res = await exec();

        expect(Object.keys(res.body)).toEqual(
            expect.arrayContaining(["dateOut", "dateReturned", "rentalFee", "customer", "movie"])
        )
    })
})