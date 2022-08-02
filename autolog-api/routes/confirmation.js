const express = requre('express')
const router = express.Router();
const Confirmation = require('../models/confirmation')

router.patch('/:token', async (req, res, next) => {
    try {
        const { user: { id } } = jwt.verify(req.params.token, EMAIL_SECRET);

    }
});