const axios = require("axios");
const marvelHeaders = require("../helpers/marvelHeaders");

module.exports = charactersController = {
  /**
   *
   * this function retrives data from Marvel API if data is NOT in redis cache
   */
  getCharaters: async (req, res) => {
    try {
      const { pageNumber } = req.params;
      const { client } = req;
      const { data } = await axios.get(`${process.env.MARVEL_URL}`, { params: marvelHeaders(pageNumber) });

      //set data into redis (indexed by page Number)
      client.setEx(`charactersPage-${pageNumber}`, process.env.CACHE_TIME, JSON.stringify(data));
      console.log("characters retrieved from Marvel API");

      res.status(200).send(data);
    } catch (err) {
      res.status(500).send({ error: err.message });
    }
  },
};
