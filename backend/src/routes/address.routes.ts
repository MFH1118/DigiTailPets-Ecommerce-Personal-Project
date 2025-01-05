// src/routes/address.routes.ts

import express, { Router } from 'express';
import { AddressController } from '../controllers/address.controller.js';
import { authenticateUser, validateAddressOwnership} from '../middleware/auth.middleware.js';

const router: Router = express.Router();

// require authentication for all routes
router.use(authenticateUser);

// create new address route
router.post('/', AddressController.createAddress);

// get all addresses route
router.get('/', AddressController.getUserAddresses);

// get default address route
router.get('/default', AddressController.getDefaultAddress);

// update address route
router.put('/:addressId', validateAddressOwnership, AddressController.updateAddress);

// delete address route
router.delete('/:addressId', validateAddressOwnership, AddressController.deleteAddress);

// set default address route
router.put('/:addressId/set-default', validateAddressOwnership, AddressController.setDefaultAddress);

export default router;


