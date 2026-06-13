import express from "express";
import matchesRoutes from "../routes/match.routes.js";

const router = express.Router();

router.use("/matches", matchesRoutes);

export default router;