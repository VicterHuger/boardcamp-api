import { Router } from "express";
import {customerBodyValidation, validateCpfBodyCreate ,validateCpfQueryString,validateIdParams, validateCpfBodyUpdate} from '../middlewares/customerValidation.js';
import {createCustomer,getCustomers,getCustomerById, updateCustomerById} from '../controllers/customerController.js';

const router=Router();

router.post('/customers',customerBodyValidation,validateCpfBodyCreate, createCustomer);
router.get('/customers',validateCpfQueryString, getCustomers);
router.get('/customers/:id',validateIdParams,getCustomerById);
router.put('/customers/:id',customerBodyValidation,validateIdParams,validateCpfBodyUpdate,updateCustomerById);

export default router;