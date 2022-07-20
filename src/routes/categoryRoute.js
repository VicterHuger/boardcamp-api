import { Router } from "express";
import { categoryBodyValidation } from "../middlewares/categoryValidation.js";
import { getCategories, signupNewCategory } from "../controllers/categoryControllers.js";

const router=Router();

router.get('/categories', getCategories);
router.post('/categories',categoryBodyValidation,signupNewCategory);

export default router;