const jwts = require("jwt-simple");
const moment = require("moment");
require("dotenv").config();

const SECRET = process.env.SECRET;

const generateToken = (user) => {
    const payload = {
        id: user._id,
        iat: moment().unix(),
        exp: moment().add(30, "days").unix()
    }

    return jwts.encode(payload, SECRET);
}

module.exports = {
    generateToken
}