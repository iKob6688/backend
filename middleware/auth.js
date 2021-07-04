const user = require('../models/user');
const md5 = require('md5');
const jwt = require("jsonwebtoken")
const { successResponse, unauthorizedResponse, ErrorResponse, successResponseWithData } = require('../helpers/apiResponses');
require('dotenv').config();
const jwtKey = process.env.JWTKEY
const jwtExpirySeconds = process.env.JWTEXPIRYSECONDS

const signIn = async (req, res) => {
    try {
        var { username, password } = req.body
        password = password.trim();
        // const users = await user.findOne({ username, password: md5(password.trim()) })
        if (!(username === "demo" && password === "demo@123")) {
            const data = {
                msg: 'user credentails was wrong',
                user: {}
            }
            successResponse(res, true, data)
        }
        else {

            const _token = jwt.sign({ username }, jwtKey, {
                algorithm: "HS256",
                expiresIn: jwtExpirySeconds,
            })

            // const refresh_token = jwt.sign({ userid: users._id}, jwtKeyRefresh, {
            //     algorithm: "HS256",
            //     expiresIn: jwtExpirySecondsRefresh
            // })

            // console.log(refresh_token)
            // await token_list.create({ refresh_token, email_id })

            const data = {
                msg: 'login successfully',
                _token
            }
            successResponseWithData(res, "Login Successful", {_token})
        }
    } catch (error) {
        console.log(error.message);
        ErrorResponse(res, error.message)
    }

}

const welcome = (req, res, next) => {

    let token = req.headers["x-access-token"] || req.headers["authorization"];
    if (!token) {
        var data = {
            error: true,
            message: "You need to login first...",
        };
        return res.status(200).json(data);
    } else {
        if (token.startsWith("Bearer ")) {
            var payload;

            try {
                token = token.split(" ")[1];
                payload = jwt.verify(token, jwtKey);
                // console.log(payload);
                req.userid = payload.userid
                next();
            } catch (e) {
                console.log(e.message);
                if (e instanceof jwt.JsonWebTokenError) {
                    successResponse(res, true, {
                        message: {
                            msg: e.message,
                        }
                    })
                }
                else {
                    successResponse(res, true, {
                        message: {
                            msg: "Login Again...",
                        }
                    })
                }

            }
        }
    }
};


module.exports = { signIn, welcome }