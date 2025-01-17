/*
  Warnings:

  - You are about to drop the column `order_id` on the `payment_details` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "payment_details" DROP CONSTRAINT "payment_details_order_id_fkey";

-- DropIndex
DROP INDEX "payment_details_order_id_key";

-- DropIndex
DROP INDEX "products_prod_is_active_idx";

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "address_id" TEXT,
ADD COLUMN     "payment_id" TEXT;

-- AlterTable
ALTER TABLE "payment_details" DROP COLUMN "order_id";

-- CreateTable
CREATE TABLE "audit_logs" (
    "auditlog_id" TEXT NOT NULL,
    "auditlog_action" TEXT NOT NULL,
    "auditlog_timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "auditlog_ip_address" TEXT NOT NULL,
    "auditlog_details" TEXT,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("auditlog_id")
);

-- CreateIndex
CREATE INDEX "audit_logs_user_id_idx" ON "audit_logs"("user_id");

-- CreateIndex
CREATE INDEX "audit_logs_auditlog_timestamp_idx" ON "audit_logs"("auditlog_timestamp");

-- CreateIndex
CREATE INDEX "audit_logs_auditlog_action_idx" ON "audit_logs"("auditlog_action");

-- CreateIndex
CREATE INDEX "audit_logs_user_id_auditlog_timestamp_idx" ON "audit_logs"("user_id", "auditlog_timestamp");

-- CreateIndex
CREATE INDEX "addresses_address_is_default_idx" ON "addresses"("address_is_default");

-- CreateIndex
CREATE INDEX "authentications_auth_login_attempts_auth_lockout_end_time_idx" ON "authentications"("auth_login_attempts", "auth_lockout_end_time");

-- CreateIndex
CREATE INDEX "orders_user_id_order_status_idx" ON "orders"("user_id", "order_status");

-- CreateIndex
CREATE INDEX "orders_user_id_order_date_idx" ON "orders"("user_id", "order_date");

-- CreateIndex
CREATE INDEX "payment_details_user_id_payment_status_idx" ON "payment_details"("user_id", "payment_status");

-- CreateIndex
CREATE INDEX "products_prod_is_active_category_id_idx" ON "products"("prod_is_active", "category_id");

-- CreateIndex
CREATE INDEX "products_prod_name_idx" ON "products"("prod_name");

-- CreateIndex
CREATE INDEX "products_prod_stock_quantity_idx" ON "products"("prod_stock_quantity");

-- CreateIndex
CREATE INDEX "sessions_session_token_idx" ON "sessions"("session_token");

-- CreateIndex
CREATE INDEX "sessions_session_expiry_idx" ON "sessions"("session_expiry");

-- CreateIndex
CREATE INDEX "users_user_email_idx" ON "users"("user_email");

-- CreateIndex
CREATE INDEX "users_user_name_idx" ON "users"("user_name");

-- CreateIndex
CREATE INDEX "users_user_is_active_idx" ON "users"("user_is_active");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "addresses"("address_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payment_details"("payment_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
