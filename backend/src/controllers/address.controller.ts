//src/controllers/address.controller.ts

import { Request, Response } from 'express';
import { AddressModel } from '../model/address.model.js';
import { AddressRequest, AddressType, ErrorResponse } from '../types/address.types.js';

export class AddressController {
    
    static async createAddress(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.user?.userId as string;
            const addressData: AddressRequest = req.body;

            const newAddress = await AddressModel.createAddress(userId, addressData);

            return res.status(201).json({
                message: 'Address created successfully',
                address: newAddress
            });
            
        } catch (error: any) {
            const errorResponse: ErrorResponse = {
                error: 'Error creating address',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            };

            return res.status(500).json(errorResponse);
        }
    }

    static async getUserAddresses(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.user?.userId as string;
            const addresses = await AddressModel.getAddressesByUserId(userId);

            return res.status(200).json({
                addresses
            });
            
        } catch (error: any) {
            const errorResponse: ErrorResponse = {
                error: 'Error fetching addresses',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            };
            return res.status(500).json(errorResponse);
            
        }
    }

    static async updateAddress(req: Request, res: Response): Promise<Response> {
        try {
            const addressId = req.params.addressId as string;
            const addressData: Partial<AddressRequest> = req.body;

            const updatedAddress = await AddressModel.updateAddress(addressId, addressData);

            return res.status(200).json({
                message: 'Address updated successfully',
                address: updatedAddress
            });
            
        } catch (error: any) {
            const errorResponse: ErrorResponse = {
                error: 'Error updating address',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            };

            return res.status(500).json(errorResponse);
            
        }
    }

    static async deleteAddress(req: Request, res: Response): Promise<Response> {
        try {
            const addressId = req.params.addressId as string;
            await AddressModel.deleteAddress(addressId);

            return res.status(200).json({
                message: 'Address deleted successfully'
            });
            
        } catch (error: any) {
            const errorResponse: ErrorResponse = {
                error: 'Error deleting address',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            };

            return res.status(500).json(errorResponse);
            
        }
    }

    static async setDefaultAddress(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.user?.userId as string;
            const addressId = req.params.addressId as string;

            const address = await AddressModel.getAddressById(addressId);

            if (address.isDefault) {
                return res.status(200).json({
                    message: 'Address is already set as default'
                });
            }

            await AddressModel.setDefaultAddress(userId, addressId);

            return res.status(200).json({
                message: 'Default address set successfully'
            });
            
        } catch (error: any) {
            const errorResponse: ErrorResponse = {
                error: 'Error setting default address',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            };

            return res.status(500).json(errorResponse);
            
        }
    }

    static async getDefaultAddress(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.user?.userId as string;
            const addressType = req.query?.type as AddressType;

            if (!addressType || !['SHIPPING', 'BILLING'].includes(addressType)) {
                return res.status(400).json({
                    error: 'Invalid address type',
                    details: 'Address type must be either SHIPPING or BILLING'
                });
            }

            const defaultAddress = await AddressModel.getDefaultAddressByType(userId, addressType);

            if (!defaultAddress) {
                return res.status(404).json({
                    message: `No default ${addressType.toLowerCase()} address found`
                });
            }

            return res.status(200).json({
                address: defaultAddress
            });
            
        } catch (error: any) {
            const errorResponse: ErrorResponse = {
                error: 'Error fetching default address',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            };

            return res.status(500).json(errorResponse);
            
        }
    }
}