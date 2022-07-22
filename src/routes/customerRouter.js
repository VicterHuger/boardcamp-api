import { Router } from "express";
import {customerBodyValidation, validateCpfQueryString,validateIdParams} from '../middlewares/customerValidation.js';
import {createCustomer,getCustomers,getCustomerById, updateCustomerById} from '../controllers/customerController.js';

const router=Router();

router.post('/customers',customerBodyValidation, createCustomer);
router.get('/customers',validateCpfQueryString, getCustomers);
router.get('/customers/:id',validateIdParams,getCustomerById);
router.put('/customers/:id',customerBodyValidation,validateIdParams,updateCustomerById);

export default router;