const request = require("supertest");

const {Genre} = require("../../models/Genre");
const {User} = require("../../models/User");

let server;

describe("Auth Middleware", () => {
    beforeEach(() => { server = require("../../app");})
    afterEach(async () => {
        await server.close();
        await Genre.deleteMany({});
    })

    let token;

    const exec = async () => {
        return await request(server)
            .post("/api/genres")
            .set("x-auth", token)
            .send({name: "genre1"});
    }

    beforeEach(()=>{
        token = new User().generateAuthToken();
    });

    it("Should return 401 if the client is not logged in", async () => {
        token = '';
        const res = await exec();

        expect(res.status).toBe(401);
    });

    it("Should return 400 if the token is invalid", async () => {
        token = 'a';
        const res = await exec();

        expect(res.status).toBe(400);
    })

    it("Should return 200 if the token is valid", async () => {
        const res = await exec();

        expect(res.status).toBe(200);
    })
})