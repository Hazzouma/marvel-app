const path = require("path");
const express = require("express");
const redisClient = require("./helpers/redisBib");
require("dotenv").config();

//redis
const client = redisClient.configRedis();
redisClient.connectRedis(client);

//init express app
const app = express();

//use routes + apply redis
app.use("/api", (req, res, next) => redisClient.useRedisMiddleware(req, res, next, client), require("./routes/charactersRoutes"));

app.use(express.static(path.join(__dirname, "client")));
app.get("/", function (req, res) {
  res.sendFile("index.html");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, (err) => (!err ? console.log(`Server listening on port: ${PORT}`) : console.error(err)));
