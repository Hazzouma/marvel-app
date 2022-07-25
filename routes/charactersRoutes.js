const charactersRouter = require("express").Router();
const redisBib = require("../helpers/redisBib");
const charactersController = require("../controllers/charactersController");

charactersRouter.get("/users/:pageNumber", redisBib.cacheDataMiddleware, charactersController.getCharaters);
module.exports = charactersRouter;
