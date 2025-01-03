-- CreateTable
CREATE TABLE "addresses" (
    "address_id" TEXT NOT NULL,
    "address_street_1" TEXT NOT NULL,
    "address_street_2" TEXT,
    "address_city" TEXT NOT NULL,
    "address_state" TEXT NOT NULL,
    "address_postal_code" TEXT NOT NULL,
    "address_country" TEXT NOT NULL,
    "address_type" TEXT NOT NULL,
    "address_is_default" BOOLEAN NOT NULL DEFAULT false,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("address_id")
);

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
