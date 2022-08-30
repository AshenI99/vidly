const mongoose = require("mongoose");

const { User } = require("../../../models/User");
const auth = require("../../../middlewares/auth");

describe('Auth Middleware', () => {
    it('Should populate req.user with the payload of the valid JWT', () => {
        const user = { _id: mongoose.Types.ObjectId(), isAdmin: true }
        const token = new User(user).generateAuthToken();

        const req = {
            header: jest.fn().mockReturnValue(token)
        }
        const res = {};
        const next = jest.fn();

        auth(req, res, next);

        expect(req.user).toMatchObject(user);
    })
});