import Router from 'express';
import categoryRoute from './categoryRoute.js';
import customersRoute from './customerRouter.js';

const router=Router();

router.use([categoryRoute,customersRoute]);

export default router;