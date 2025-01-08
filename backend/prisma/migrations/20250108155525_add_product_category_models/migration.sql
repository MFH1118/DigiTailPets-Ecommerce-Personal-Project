-- CreateTable
CREATE TABLE "products" (
    "prod_id" TEXT NOT NULL,
    "prod_name" TEXT NOT NULL,
    "prod_desc" TEXT,
    "prod_price" DECIMAL(10,2) NOT NULL,
    "prod_stock_quantity" INTEGER NOT NULL,
    "prod_is_active" BOOLEAN NOT NULL DEFAULT true,
    "prod_sku" TEXT NOT NULL,
    "prod_image_url" TEXT,
    "prod_added_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "prod_modified_date" TIMESTAMP(3),
    "category_id" TEXT NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("prod_id")
);

-- CreateTable
CREATE TABLE "categories" (
    "category_id" TEXT NOT NULL,
    "category_name" TEXT NOT NULL,
    "category_desc" TEXT,
    "category_is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("category_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "products_prod_sku_key" ON "products"("prod_sku");

-- CreateIndex
CREATE INDEX "products_category_id_idx" ON "products"("category_id");

-- CreateIndex
CREATE INDEX "products_prod_sku_idx" ON "products"("prod_sku");

-- CreateIndex
CREATE INDEX "products_prod_is_active_idx" ON "products"("prod_is_active");

-- CreateIndex
CREATE UNIQUE INDEX "categories_category_name_key" ON "categories"("category_name");

-- CreateIndex
CREATE INDEX "categories_category_is_active_idx" ON "categories"("category_is_active");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("category_id") ON DELETE RESTRICT ON UPDATE CASCADE;
