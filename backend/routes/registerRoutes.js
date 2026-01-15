const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const sampleData = {
        name : "Gargi"
    }
    res.json(sampleData);
});

module.exports = router;