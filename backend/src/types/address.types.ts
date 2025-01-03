// src/types/address.types.ts

export type AddressType = 'SHIPPING' | 'BILLING';

export interface Address {
    addressId: string;
    userId: string;
    street1: string;
    street2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    addressType: AddressType;
    isDefault: boolean;
}

export interface AddressRequest {
    street1: string;
    street2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    addressType: AddressType;
    isDefault?: boolean;
}

export interface AddressResponse {
    message: string;
    address: Address;
}

export interface AddressSelect {
    id: true;
    userId: true;
    street1: true;
    street2: true;
    city: true;
    state: true;
    postalCode: true;
    country: true;
    addressType: true;
    isDefault: true;
}

export interface ErrorResponse {
    error: string;
    details?: string;
}