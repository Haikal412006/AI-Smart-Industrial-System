const axios = require('axios');

setInterval(async () => {

    const data = {

        temperature: (Math.random() * 100).toFixed(2),
        humidity: (Math.random() * 100).toFixed(2),
        gas: (Math.random() * 50).toFixed(2)

    };

    try {

        const response = await axios.post(
            'http://localhost:5000/api/sensor',
            data
        );

        console.log(response.data);

    } catch (err) {

        console.log(err.message);

    }

}, 3000);