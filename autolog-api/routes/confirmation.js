const express = require('express');
const { API_BASE_URL } = require('../constants');
const router = express.Router();
const Confirmation = require('../models/confirmation')

router.get('/:token', async (req, res, next) => {
    try {
        // Verify the token and update the email_confirmed status of the given user
        const id = Confirmation.verifyConfirmationToken(req.params.token, process.env.EMAIL_SECRET_KEY);
        const user = await Confirmation.updateConfirmationStatus(id)

        // If verification and update was a success, send to login page.
        // Login will no longer fail because the user email_confirmed field is now TRUE instead of FALSE
        return res.redirect(`${API_BASE_URL}login`)
    }   
    catch (error) {
        next(error)
    }
});

module.exports = router;