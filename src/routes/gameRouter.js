import { Router } from "express";
import { createGame, getGames } from "../controllers/gameController.js";
import { gameBodyValidation } from "../middlewares/gameValidation.js";

const router=Router();
 router.get('/games',getGames);
router.post('/games',gameBodyValidation,createGame);

export default router;