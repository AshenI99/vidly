const request = require("supertest");

const { Genre } = require("../../models/Genre");
const { User } = require("../../models/User");

let server;

describe("/api/genres", () => {
    beforeEach(() => { server = require("../../app") })
    afterEach(async () => {
        await server.close();
        await Genre.deleteMany({});
    });

    describe("GET /", () => {
        it("Should return all genres", async () => {
            await Genre.collection.insertMany([
                { name: "genre1" },
                { name: "genre2" },
                { name: "genre3" },
            ])

            const res = await request(server).get('/api/genres');

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(3);
            expect(res.body.some((el)=> el.name === "genre1")).toBeTruthy();
            expect(res.body.some((el)=> el.name === "genre2")).toBeTruthy();
        })
    });

    describe("GET /:id", () => {
        it("Should return a genre if valid id is passed", async () => {
            const genre = new Genre({ name: "genre1"} );
            await genre.save();

            const res = await request(server).get(`/api/genres/${genre._id}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("name", "genre1");
        })

        it("Should return 404 if invalid id is passed", async () => {
            const res = await request(server).get("/api/genres/1");

            expect(res.status).toBe(404);
        })
    });

    describe("POST /", () => {

        let token;
        let genreName;

        const exec = async () => {
            return await request(server)
                .post("/api/genres")
                .set("x-auth", token)
                .send({name: genreName});
        }

        beforeEach(()=>{
            token = new User().generateAuthToken();
            genreName = "genre1";
        })

        it("Should return 401 if client is not logged in", async () => {
            token = '';
            const res = await exec();

            expect(res.status).toBe(401);
        });

        it("Should return 400 if genre name is less than 5 characters", async () => {
            genreName = 'aaa';
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it("Should return 400 if genre name is more than 50 characters", async () => {
            genreName = new Array(52).join('a');
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it("Should save the genre if it is valid", async () => {
            const res = await exec();
            const genre = await Genre.find({ name: "genre1" });

            expect(res.status).toBe(200);
            expect(genre).not.toBeNull();
        });

        it("Should return the genre if it is valid", async () => {
            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("_id");
            expect(res.body).toHaveProperty("name", "genre1");
        });
    });
})