// src/model/address.model.ts
import prisma from '../db/prisma.js';
import { Address, AddressRequest } from '../types/address.types.js';

export class AddressModel {

    // private function to check address exists
    private static async checkAddressExists(userId: string, addressData: AddressRequest): Promise<boolean> {
        const existingAddress = await prisma.address.findFirst({
            where: {
                userId,
                street1: addressData.street1,
                street2: addressData.street2 || null,
                city: addressData.city,
                state: addressData.state,
                postalCode: addressData.postalCode,
                country: addressData.country,
                addressType: addressData.addressType
            }
        });
        return !!existingAddress;
    }

    // private function to check if address is already default for given type
    private static async isAddressAlreadyDefault(userId: string, addressId: string, addressType: string): Promise<boolean> {
        const address = await prisma.address.findFirst({
            where: {
                id: addressId,
                userId,
                addressType,
                isDefault: true
            }
        });
        return !!address;
    }

    // private function to unset default address
    private static async unsetDefaultAddress(userId: string, addressType: string): Promise<void> {
        try {
            await prisma.address.updateMany({
                where: {
                    userId,
                    addressType,
                    isDefault: true
                },
                data: {
                    isDefault: false
                }
            });
        } catch (error: any) {
            throw new Error(`Error unsetting default address: ${error.message}`);
        }
    }

    // create a new address
    static async createAddress(userId: string, addressData: AddressRequest): Promise<Address> {
        try {

            // check if address already exist
            const addressExists = await this.checkAddressExists(userId, addressData);
            if (addressExists) {
                throw new Error('Address already exists');
            }

            if (addressData.isDefault) {
                await this.unsetDefaultAddress(userId, addressData.addressType);
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
                isDefault: address.isDefault
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
                        userId: true,
                        addressType: true
                    }
                });

                if (address) {
                    await this.unsetDefaultAddress(address.userId, address.addressType);
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
            // get the address type
            const address = await prisma.address.findUnique({
                where: { id: addressId },
                select: { 
                    addressType: true 
                }
            });

            if (!address) {
                throw new Error('Address not found');
            }

            // check if address is already default
            const isAlreadyDefault = await this.isAddressAlreadyDefault(userId, addressId, address.addressType);

            if (isAlreadyDefault) {
                return;
            }

            // unset existing default address of the same type
            await this.unsetDefaultAddress(userId, address.addressType);

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

    static async getDefaultAddressByType(userId: string, addressType: 'SHIPPING' | 'BILLING'): Promise<Address | null> {
        try {
            const defaultAddress = await prisma.address.findFirst({
                where: {
                    userId,
                    addressType,
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
            };
            
        } catch (error: any) {
            throw new Error(`Error fetching address: ${error.message as Error}`);
            
        }
    }
}