import express from "express";
import { validatorMiddleware } from "../middleware/validator.middleware.js";
import { createMatchSchema } from "../schema/match.schema.js";
import { create, fetchAll } from "../controllers/match.controller.js";

const matchRouter = express.Router();

matchRouter.get("/", fetchAll);

matchRouter.post("/", validatorMiddleware({ body: createMatchSchema }), create);

export default matchRouter;