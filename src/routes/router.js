import Router from 'express';
import categoryRoute from './categoryRoute.js';

const router=Router();

router.use([categoryRoute]);

export default router;