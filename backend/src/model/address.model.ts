// src/model/address.model.ts
import prisma from '../db/prisma.js';
import { Address, AddressRequest } from '../types/address.types.js';

export class AddressModel {

    // private function to unset default address
    private static async unsetDefaultAddress(userId: string): Promise<void> {
        try {
            // check first if there is a default address
            const defaultAddress = await prisma.address.findFirst({
                where: {
                    userId,
                    isDefault: true
                }
            });
            
            if (!defaultAddress) {
                return;
            }
            
            await prisma.address.updateMany({
                where: {
                    userId,
                    isDefault: true
                },
                data: {
                    isDefault: false
                }
            });

        } catch (error: any) {
            throw new Error(`Error unsetting default address: ${error.message as Error}`);
            
        }
    }

    // create a new address
    static async createAddress(userId: string, addressData: AddressRequest): Promise<Address> {
        try {

            if (addressData.isDefault) {
                await this.unsetDefaultAddress(userId);
            }

            const address = await prisma.address.create({
                data: {
                    userId,
                    street1: addressData.street1,
                    street2 : addressData.street2,
                    city : addressData.city,
                    state : addressData.state,
                    postalCode : addressData.postalCode,
                    country : addressData.country,
                    addressType : addressData.addressType,
                    isDefault : addressData.isDefault || false
                },
                select: {
                    id: true,
                    userId: true,
                    street1: true,
                    street2: true,
                    city: true,
                    state: true,
                    postalCode: true,
                    country: true,
                    addressType: true,
                    isDefault: true
                }
            });

            return {
                addressId: address.id,
                userId: address.userId,
                street1: address.street1,
                street2: address.street2 || undefined,
                city: address.city,
                state: address.state,
                postalCode: address.postalCode,
                country: address.country,
                addressType: address.addressType as 'SHIPPING' | 'BILLING',
                isDefault: false
            }

        } catch (error: any) {
            throw new Error(`Error creating address: ${error.message as Error}`);
            
        }
    }

    // get address by id
    static async getAddressById(addressId: string): Promise<Address> {
        try {
            const address = await prisma.address.findUnique({
                where: { id: addressId },
                select: {
                    id: true,
                    userId: true,
                    street1: true,
                    street2: true,
                    city: true,
                    state: true,
                    postalCode: true,
                    country: true,
                    addressType: true,
                    isDefault: true
                }
            });

            if (!address) {
                throw new Error('Address not found');
            }

            return {
                addressId: address.id,
                userId: address.userId,
                street1: address.street1,
                street2: address.street2 || undefined,
                city: address.city,
                state: address.state,
                postalCode: address.postalCode,
                country: address.country,
                addressType: address.addressType as 'SHIPPING' | 'BILLING',
                isDefault: address.isDefault
            }

        } catch (error: any) {
            throw new Error(`Error fetching address: ${error.message as Error}`);
        }
    }
    // get all addresses of users.
    static async getAddressesByUserId(userId: string): Promise<Address[]> {
        try {
            const addresses = await prisma.address.findMany({
                where: { userId },
                select: {
                    id: true,
                    userId: true,
                    street1: true,
                    street2: true,
                    city: true,
                    state: true,
                    postalCode: true,
                    country: true,
                    addressType: true,
                    isDefault: true
                }
            });

            if (!addresses) {
                return [];
            }

            return addresses.map(address => ({
                addressId: address.id,
                userId: address.userId,
                street1: address.street1,
                street2: address.street2 || undefined,
                city: address.city,
                state: address.state,
                postalCode: address.postalCode,
                country: address.country,
                addressType: address.addressType as 'SHIPPING' | 'BILLING',
                isDefault: address.isDefault
            }))

        } catch (error: any) {
            throw new Error(`Error fetching addresses: ${error.message as Error}`);
            
        }
    }

    static async updateAddress(addressId: string, addressData: Partial<AddressRequest>): Promise<Address> {
        try {
            if (addressData.isDefault) {
                const address = await prisma.address.findUnique({
                    where: { id: addressId },
                    select: {
                        userId: true
                    }
                });

                if (address) {
                    await this.unsetDefaultAddress(address.userId);
                }
            }

            const updatedAddress = await prisma.address.update({
                where: { id: addressId },
                data: addressData,
                select: {
                    id: true,
                    userId: true,
                    street1: true,
                    street2: true,
                    city: true,
                    state: true,
                    postalCode: true,
                    country: true,
                    addressType: true,
                    isDefault: true
                }
            });

            return {
                addressId: updatedAddress.id,
                userId: updatedAddress.userId,
                street1: updatedAddress.street1,
                street2: updatedAddress.street2 || undefined,
                city: updatedAddress.city,
                state: updatedAddress.state,
                postalCode: updatedAddress.postalCode,
                country: updatedAddress.country,
                addressType: updatedAddress.addressType as 'SHIPPING' | 'BILLING',
                isDefault: updatedAddress.isDefault
            }
            
        } catch (error: any) {
            throw new Error(`Error updating address: ${error.message as Error}`);
            
        }
    }

    static async deleteAddress(addressId: string): Promise<void> {
        try {
            await prisma.address.delete({
                where: { id: addressId }
            });

        } catch (error: any) {
            throw new Error(`Error deleting address: ${error.message as Error}`);
        }
    }

    static async setDefaultAddress(userId: string, addressId: string): Promise<void> {
        try {
            await this.unsetDefaultAddress(userId);

            await prisma.address.update({
                where: { id: addressId },
                data: {
                    isDefault: true
                }
            });
            
        } catch (error: any) {
            throw new Error(`Error setting default address: ${error.message as Error}`);
            
        }
    }

    static async getDefaultAddress(userId: string): Promise<Address | null> {
        try {
            const defaultAddress = await prisma.address.findFirst({
                where: {
                    userId,
                    isDefault: true
                },
                select: {
                    id: true,
                    userId: true,
                    street1: true,
                    street2: true,
                    city: true,
                    state: true,
                    postalCode: true,
                    country: true,
                    addressType: true,
                    isDefault: true
                }
            });

            if (!defaultAddress) {
                return null;
            }

            return {
                addressId: defaultAddress.id,
                userId: defaultAddress.userId,
                street1: defaultAddress.street1,
                street2: defaultAddress.street2 || undefined,
                city: defaultAddress.city,
                state: defaultAddress.state,
                postalCode: defaultAddress.postalCode,
                country: defaultAddress.country,
                addressType: defaultAddress.addressType as 'SHIPPING' | 'BILLING',
                isDefault: defaultAddress.isDefault
            }
            
        } catch (error: any) {
            throw new Error(`Error fetching default address: ${error.message as Error}`);
            
        }
    }
}