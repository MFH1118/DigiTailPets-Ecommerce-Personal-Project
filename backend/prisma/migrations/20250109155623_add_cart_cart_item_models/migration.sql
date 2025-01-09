-- CreateTable
CREATE TABLE "carts" (
    "cart_id" TEXT NOT NULL,
    "cart_creation_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cart_last_update" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "carts_pkey" PRIMARY KEY ("cart_id")
);

-- CreateTable
CREATE TABLE "cart_items" (
    "cart_item_id" TEXT NOT NULL,
    "cart_item_quantity" INTEGER NOT NULL,
    "cart_item_unitprice" DECIMAL(10,2) NOT NULL,
    "cart_item_subtotal" DECIMAL(10,2) NOT NULL,
    "cart_id" TEXT NOT NULL,
    "prod_id" TEXT NOT NULL,

    CONSTRAINT "cart_items_pkey" PRIMARY KEY ("cart_item_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "carts_user_id_key" ON "carts"("user_id");

-- CreateIndex
CREATE INDEX "cart_items_cart_id_idx" ON "cart_items"("cart_id");

-- CreateIndex
CREATE INDEX "cart_items_prod_id_idx" ON "cart_items"("prod_id");

-- CreateIndex
CREATE UNIQUE INDEX "cart_items_cart_id_prod_id_key" ON "cart_items"("cart_id", "prod_id");

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "carts"("cart_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_prod_id_fkey" FOREIGN KEY ("prod_id") REFERENCES "products"("prod_id") ON DELETE RESTRICT ON UPDATE CASCADE;
