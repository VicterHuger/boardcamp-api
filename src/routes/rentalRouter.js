import { Router } from 'express';
import { creteRental, deleteRental, getRentals, returnRental } from '../controllers/rentalController.js';
import { createQueryRentals, rentalBodyValidation,rentalQueryStringValidation, validateDeleteRental, validateRentalReturn } from '../middlewares/rentalValidation.js';

const router=Router();

router.get('/rentals', rentalQueryStringValidation, createQueryRentals ,getRentals);
router.post('/rentals', rentalBodyValidation, creteRental);
router.post('/rentals/:id/return', validateRentalReturn, returnRental);
router.delete('/rentals/:id', validateDeleteRental, deleteRental )


export default router;