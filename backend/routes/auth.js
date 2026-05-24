const express = require('express');
const router = express.Router();

router.post('/login', async (req, res) => {

    const { username, password } = req.body;

    if(username === 'admin' && password === 'admin123'){

        return res.json({
            success:true,
            token:'admin-token'
        });

    }

    res.status(401).json({
        success:false,
        message:'Login gagal'
    });

});

module.exports = router;