const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        message: 'this is profile'
    });
});



module.exports = router;