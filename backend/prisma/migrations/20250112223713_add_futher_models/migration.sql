-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ShipmentStatus" AS ENUM ('PENDING', 'PROCESSING', 'SHIPPED', 'IN_TRANSIT', 'DELIVERED', 'FAILED', 'RETURNED');

-- CreateTable
CREATE TABLE "orders" (
    "order_id" TEXT NOT NULL,
    "order_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "order_total" DECIMAL(10,2) NOT NULL,
    "order_status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "payment_status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "last_updated" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,
    "shipping_id" TEXT,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("order_id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "order_item_id" TEXT NOT NULL,
    "order_quantity" INTEGER NOT NULL,
    "order_unitprice" DECIMAL(10,2) NOT NULL,
    "order_subtotal" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "order_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("order_item_id")
);

-- CreateTable
CREATE TABLE "payment_details" (
    "payment_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "payment_amount" DECIMAL(10,2) NOT NULL,
    "payment_currency" TEXT NOT NULL,
    "payment_method" TEXT NOT NULL,
    "payment_provider" TEXT NOT NULL,
    "payment_status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "payment_transaction_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "payment_authorization_code" TEXT,
    "payment_four_digit_num" TEXT,
    "payment_expiration_date" TIMESTAMP(3),
    "order_id" TEXT,

    CONSTRAINT "payment_details_pkey" PRIMARY KEY ("payment_id")
);

-- CreateTable
CREATE TABLE "shipments" (
    "shipment_id" TEXT NOT NULL,
    "shipment_carrier" TEXT NOT NULL,
    "shipment_tracking_num" TEXT,
    "shipment_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shipment_est_delivery" TIMESTAMP(3),
    "shipment_actual_delivery" TIMESTAMP(3),
    "shipment_status" "ShipmentStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "shipments_pkey" PRIMARY KEY ("shipment_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "orders_shipping_id_key" ON "orders"("shipping_id");

-- CreateIndex
CREATE INDEX "orders_user_id_idx" ON "orders"("user_id");

-- CreateIndex
CREATE INDEX "orders_order_status_idx" ON "orders"("order_status");

-- CreateIndex
CREATE INDEX "orders_order_date_idx" ON "orders"("order_date");

-- CreateIndex
CREATE INDEX "orders_payment_status_idx" ON "orders"("payment_status");

-- CreateIndex
CREATE INDEX "order_items_order_id_idx" ON "order_items"("order_id");

-- CreateIndex
CREATE INDEX "order_items_product_id_idx" ON "order_items"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "payment_details_order_id_key" ON "payment_details"("order_id");

-- CreateIndex
CREATE INDEX "payment_details_user_id_idx" ON "payment_details"("user_id");

-- CreateIndex
CREATE INDEX "payment_details_payment_status_idx" ON "payment_details"("payment_status");

-- CreateIndex
CREATE INDEX "payment_details_payment_transaction_date_idx" ON "payment_details"("payment_transaction_date");

-- CreateIndex
CREATE INDEX "shipments_shipment_status_idx" ON "shipments"("shipment_status");

-- CreateIndex
CREATE INDEX "shipments_shipment_date_idx" ON "shipments"("shipment_date");

-- CreateIndex
CREATE INDEX "addresses_user_id_address_type_idx" ON "addresses"("user_id", "address_type");

-- CreateIndex
CREATE INDEX "products_prod_price_idx" ON "products"("prod_price");

-- CreateIndex
CREATE INDEX "sessions_user_id_session_expiry_idx" ON "sessions"("user_id", "session_expiry");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_shipping_id_fkey" FOREIGN KEY ("shipping_id") REFERENCES "shipments"("shipment_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("order_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("prod_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_details" ADD CONSTRAINT "payment_details_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_details" ADD CONSTRAINT "payment_details_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("order_id") ON DELETE SET NULL ON UPDATE CASCADE;
