// src/model/shipping.model.ts

import prisma from '../db/prisma.js';
import { ShipmentStatus, Shipping } from '../types/shipment.types.js';

export class ShipmentModel {

    // create new shipment
    static async createShipment(orderData: {carrier: string; estimatedDelivery?: Date;}): Promise<Shipping> {
        try {
            const shipment = await prisma.shipments.create({
                data: {
                    carrier: orderData.carrier,
                    status: 'PENDING',
                    shipmentDate: new Date(),
                    estimatedDelivery: orderData.estimatedDelivery
                }
            });

            return {
                shipmentId: shipment.id,
                carrier: shipment.carrier,
                trackingNumber: shipment.trackingNumber || undefined,
                shipmentDate: shipment.shipmentDate,
                estimatedDelivery: shipment.estimatedDelivery || undefined,
                actualDelivery: shipment.actualDelivery || undefined,
                status: shipment.status as ShipmentStatus
            };
        } catch (error: any) {
            throw new Error(`Error creating shipment: ${error.message}`);
        }
    }

    // update shipment status
    static async updateShipmentStatus(shipmentId: string, status: ShipmentStatus, trackingNumber?: string): Promise<Shipping> {
        try {
            const updateData: any = {
                status,
                trackingNumber
            };

            // if status is DELIVERED, set actualDelivery date
            if (status === 'DELIVERED') {
                updateData.actualDelivery = new Date();
            }

            const shipment = await prisma.shipments.update({
                where: { id: shipmentId },
                data: updateData
            });

            return {
                shipmentId: shipment.id,
                carrier: shipment.carrier,
                trackingNumber: shipment.trackingNumber || undefined,
                shipmentDate: shipment.shipmentDate,
                estimatedDelivery: shipment.estimatedDelivery || undefined,
                actualDelivery: shipment.actualDelivery || undefined,
                status: shipment.status as ShipmentStatus
            };
        } catch (error: any) {
            throw new Error(`Error updating shipment status: ${error.message}`);
        }
    }

    // get shipment by id
    static async getShipmentById(shipmentId: string): Promise<Shipping | null> {
        try {
            const shipment = await prisma.shipments.findUnique({
                where: { id: shipmentId }
            });

            if (!shipment) {
                return null;
            }

            return {
                shipmentId: shipment.id,
                carrier: shipment.carrier,
                trackingNumber: shipment.trackingNumber || undefined,
                shipmentDate: shipment.shipmentDate,
                estimatedDelivery: shipment.estimatedDelivery || undefined,
                actualDelivery: shipment.actualDelivery || undefined,
                status: shipment.status as ShipmentStatus
            };
        } catch (error: any) {
            throw new Error(`Error fetching shipment: ${error.message}`);
        }
    }

}