/**
 *
 *
 * This file contains helper functions of Redis
 */

module.exports = client = {
  /**
   *
   * @returns redis client ready.
   */
  configRedis: () =>
    require("redis").createClient({
      url: `redis://${process.env.REDIS_URL}:${process.env.REDIS_PORT}`,
      password: process.env.REDIS_PASSWORD,
      legacyMode: true, //v3 to v4 Migration Guide => Use legacy mode to preserve the backwards compatibility of commands. More info go to: https://github.com/redis/node-redis/blob/master/docs/v3-to-v4.md
    }),

  /*
   *
   * @param {redis client} client : connect client to database
   */
  connectRedis: async (client) => {
    try {
      await client.connect();
    } catch (error) {
      throw new Error(error.message);
    }
  },

  /**
   *
   * Forward client to req
   */
  useRedisMiddleware: (req, res, next, client) => {
    req.client = client;
    next();
  },

  /**
   *
   * This function sends cached data if data exist in cache.
   */
  cacheDataMiddleware: async (req, res, next) => {
    const { pageNumber } = req.params;
    const { client } = req;

    //retriev data from redis (indexed by page Number)
    client.get(`charactersPage-${pageNumber}`, (err, data) => {
      if (err) throw new Error(err.message);
      if (data !== null) {
        console.log("characters retrieved from Redis");

        res.status(200).send(JSON.parse(data));
      } else next();
    });
  },
};
