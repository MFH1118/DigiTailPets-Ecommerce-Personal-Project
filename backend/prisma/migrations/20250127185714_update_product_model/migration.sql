/*
  Warnings:

  - You are about to drop the column `prod_image_url` on the `products` table. All the data in the column will be lost.
  - Added the required column `prod_brand` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prod_rating` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "prod_image_url",
ADD COLUMN     "prod_brand" TEXT NOT NULL,
ADD COLUMN     "prod_main_image" TEXT,
ADD COLUMN     "prod_rating" DECIMAL(65,30) NOT NULL;

-- CreateTable
CREATE TABLE "product_images" (
    "prod_image_id" TEXT NOT NULL,
    "prod_image_url" TEXT NOT NULL,
    "prod_image_is_main" BOOLEAN NOT NULL DEFAULT false,
    "prod_image_sort_order" INTEGER NOT NULL,
    "prod_id" TEXT NOT NULL,

    CONSTRAINT "product_images_pkey" PRIMARY KEY ("prod_image_id")
);

-- CreateTable
CREATE TABLE "product_features" (
    "prod_feature_id" TEXT NOT NULL,
    "prod_feature_title" TEXT NOT NULL,
    "prod_feature_desc" TEXT,
    "prod_id" TEXT NOT NULL,

    CONSTRAINT "product_features_pkey" PRIMARY KEY ("prod_feature_id")
);

-- CreateTable
CREATE TABLE "product_specifications" (
    "prod_spec_id" TEXT NOT NULL,
    "prod_spec_key" TEXT NOT NULL,
    "prod_spec_value" TEXT NOT NULL,
    "prod_id" TEXT NOT NULL,

    CONSTRAINT "product_specifications_pkey" PRIMARY KEY ("prod_spec_id")
);

-- CreateIndex
CREATE INDEX "product_images_prod_id_idx" ON "product_images"("prod_id");

-- CreateIndex
CREATE INDEX "product_features_prod_id_idx" ON "product_features"("prod_id");

-- CreateIndex
CREATE INDEX "product_specifications_prod_id_idx" ON "product_specifications"("prod_id");

-- CreateIndex
CREATE INDEX "products_prod_brand_idx" ON "products"("prod_brand");

-- CreateIndex
CREATE INDEX "products_prod_rating_idx" ON "products"("prod_rating");

-- AddForeignKey
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_prod_id_fkey" FOREIGN KEY ("prod_id") REFERENCES "products"("prod_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_features" ADD CONSTRAINT "product_features_prod_id_fkey" FOREIGN KEY ("prod_id") REFERENCES "products"("prod_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_specifications" ADD CONSTRAINT "product_specifications_prod_id_fkey" FOREIGN KEY ("prod_id") REFERENCES "products"("prod_id") ON DELETE RESTRICT ON UPDATE CASCADE;
