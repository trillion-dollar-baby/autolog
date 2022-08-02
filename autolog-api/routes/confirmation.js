const express = requre('express')
const router = express.Router();
const Confirmation = require('../models/confirmation')

router.patch('/:token', async (req, res, next) => {
    try {
        // Verify the token and update the email_confirmed status of the given user
        const { user: { id } } = Confirmation.verifyConfirmationToken(req.params.token, EMAIL_SECRET);
        await Confirmation.updateConfirmationStatus(id)
    }   
    catch (error) {
        next(error)
    }
});

module.exports = router;