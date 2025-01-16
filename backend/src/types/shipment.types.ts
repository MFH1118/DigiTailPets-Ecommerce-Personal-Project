// src/types/shipment.types.ts

export enum ShipmentStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    SHIPPED = 'SHIPPED',
    IN_TRANSIT = 'IN_TRANSIT',
    DELIVERED = 'DELIVERED',
    FAILED = 'FAILED',
    RETURNED = 'RETURNED'
}

export interface Shipping {
    shipmentId: string;
    carrier: string;
    trackingNumber?: string;
    shipmentDate: Date;
    estimatedDelivery?: Date;
    actualDelivery?: Date;
    status: ShipmentStatus;
}

export interface CreateShipmentRequest {
    carrier: string;
    estimatedDelivery?: Date;
}

export interface UpdateShipmentRequest {
    status: ShipmentStatus;
    trackingNumber?: string;
}

export interface ShipmentResponse {
    message: string;
    shipment: Shipping;
}

export interface ErrorResponse {
    error: string;
    details?: string;
}