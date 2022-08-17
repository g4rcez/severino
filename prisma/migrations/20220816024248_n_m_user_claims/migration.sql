/*
  Warnings:

  - You are about to drop the column `usersId` on the `claims` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "claims" DROP CONSTRAINT "claims_usersId_fkey";

-- AlterTable
ALTER TABLE "claims" DROP COLUMN "usersId",
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP;

-- AlterTable
ALTER TABLE "rules" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP;

-- AlterTable
ALTER TABLE "secrets" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP,
ALTER COLUMN "expires_in" SET DATA TYPE TIMESTAMP;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP;

-- CreateTable
CREATE TABLE "user_claims" (
    "id" UUID NOT NULL,
    "status" VARCHAR(36) NOT NULL,
    "usersId" UUID NOT NULL,
    "claimsId" UUID NOT NULL,
    "assigned_by" varchar(256) NOT NULL,
    "created_at" TIMESTAMP NOT NULL,

    CONSTRAINT "user_claims_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_claims" ADD CONSTRAINT "user_claims_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_claims" ADD CONSTRAINT "user_claims_claimsId_fkey" FOREIGN KEY ("claimsId") REFERENCES "claims"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
