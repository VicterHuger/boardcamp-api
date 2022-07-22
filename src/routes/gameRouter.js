import { Router } from "express";
import { getGames } from "../controllers/gameController.js";

const router=Router();
router.get('/games',getGames);
router.post('/games')


export default router;