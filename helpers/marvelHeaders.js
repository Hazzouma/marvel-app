const md5 = require("js-md5");

module.exports = marvelHeaders = (pageNumber) => {
  /**
   *
   * Fix limit as 10 items per load
   * offset skips number of page * items per single page
   * @returns headers of request to be sent to Marvel API
   */
  const limit = 10;
  const offset = limit * pageNumber;
  const ts = Number(new Date());
  const hash = md5.create();
  hash.update(ts + process.env.MARVEL_PRIVATE_KEY + process.env.MARVEL_PUB_KEY);

  return {
    ts,
    apikey: process.env.MARVEL_PUB_KEY,
    hash: hash.hex(),
    offset,
    limit,
  };
};
