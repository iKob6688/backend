'use strict'
const express = require('express');
const { signIn, welcome } = require('../middleware/auth');
const app = express();

// Importing Routers
const Profile = require('../routes/machine')

app.get('/', (req, res) => {
    return res.status(200).json({
        status: true,
        message: 'APIs working...'
    });
})

app.post('/login', signIn);

app.use('/machine', welcome,  Profile);

module.exports = app