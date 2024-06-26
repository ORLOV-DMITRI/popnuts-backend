const axios = require('axios');


const getQuote = async (req, res) => {
    try {
        const {data} = await axios.get("http://api.forismatic.com/api/1.0/", {
            params: {
                method: "getQuote",
                lang: "ru",
                format: "json"
            }
        });

        res.json(data);
    } catch (error) {
        res.status(500).send("Error fetching quote");
    }
};

module.exports = {
  getQuote
};