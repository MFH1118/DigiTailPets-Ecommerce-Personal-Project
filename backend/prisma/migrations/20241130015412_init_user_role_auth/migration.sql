-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "user_name" TEXT NOT NULL,
    "user_email" TEXT NOT NULL,
    "user_first_name" TEXT NOT NULL,
    "user_last_name" TEXT NOT NULL,
    "user_dob" TIMESTAMP(3) NOT NULL,
    "user_date_created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_last_login" TIMESTAMP(3),
    "user_is_active" BOOLEAN NOT NULL DEFAULT true,
    "role_id" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "role_name" TEXT NOT NULL,
    "role_desc" TEXT,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "authentications" (
    "id" TEXT NOT NULL,
    "auth_password_hash" TEXT NOT NULL,
    "auth_password_reset" TEXT,
    "auth_login_attempts" INTEGER NOT NULL DEFAULT 0,
    "auth_lockout_end_time" TIMESTAMP(3),
    "user_id" TEXT NOT NULL,

    CONSTRAINT "authentications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_user_name_key" ON "users"("user_name");

-- CreateIndex
CREATE UNIQUE INDEX "users_user_email_key" ON "users"("user_email");

-- CreateIndex
CREATE UNIQUE INDEX "roles_role_name_key" ON "roles"("role_name");

-- CreateIndex
CREATE UNIQUE INDEX "authentications_user_id_key" ON "authentications"("user_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "authentications" ADD CONSTRAINT "authentications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
