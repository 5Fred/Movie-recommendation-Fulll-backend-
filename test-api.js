const axios = require('axios');

// We are telling axios to go to this internet URL and get data
axios.get('https://api.tvmaze.com/search/shows?q=avatar')
    .then((response) => {
        // Axios brings back a huge package. The actual data is inside .data
        console.log("Axios successfully fetched the data!");
        console.log("First Movie Found:", response.data[0].show.name);
        console.log("Summary:", response.data[0].show.summary);
    })
    .catch((error) => {
        console.log("Something went wrong:", error.message);
    });