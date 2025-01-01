/*
  Warnings:

  - You are about to drop the column `session_refresh_token` on the `sessions` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "sessions_session_refresh_token_key";

-- AlterTable
ALTER TABLE "sessions" DROP COLUMN "session_refresh_token";
