import Router from 'express';
import categoryRoute from './categoryRoute.js';
import customersRoute from './customerRouter.js';
import gameRoute from './gameRouter.js'

const router=Router();

router.use([categoryRoute,customersRoute, gameRoute]);

export default router;