"use strict";

const express = require('express');
const got = require('got');

const router = express.Router();

router.get('/postman-endpoint', async (req, res) => {
    try {
        const data = await got('https://postman-rest-api-learner.glitch.me//info?id=1', { responseType: 'json' });
        res.json(data.body);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
