/*
  Warnings:

  - The primary key for the `claims` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `routes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `rules` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `secrets` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `user_claims` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "user_claims" DROP CONSTRAINT "user_claims_claimsId_fkey";

-- DropForeignKey
ALTER TABLE "user_claims" DROP CONSTRAINT "user_claims_usersId_fkey";

-- AlterTable
ALTER TABLE "claims" DROP CONSTRAINT "claims_pkey",
ALTER COLUMN "id" SET DATA TYPE VARCHAR(36),
ADD CONSTRAINT "claims_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "routes" DROP CONSTRAINT "routes_pkey",
ALTER COLUMN "id" SET DATA TYPE VARCHAR(36),
ADD CONSTRAINT "routes_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "rules" DROP CONSTRAINT "rules_pkey",
ALTER COLUMN "id" SET DATA TYPE VARCHAR(36),
ADD CONSTRAINT "rules_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "secrets" DROP CONSTRAINT "secrets_pkey",
ALTER COLUMN "id" SET DATA TYPE VARCHAR(36),
ADD CONSTRAINT "secrets_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "user_claims" DROP CONSTRAINT "user_claims_pkey",
ALTER COLUMN "id" SET DATA TYPE VARCHAR(36),
ALTER COLUMN "usersId" SET DATA TYPE VARCHAR(36),
ALTER COLUMN "claimsId" SET DATA TYPE VARCHAR(36),
ALTER COLUMN "assigned_by" SET DATA TYPE TEXT,
ADD CONSTRAINT "user_claims_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
ALTER COLUMN "id" SET DATA TYPE VARCHAR(36),
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "user_claims" ADD CONSTRAINT "user_claims_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_claims" ADD CONSTRAINT "user_claims_claimsId_fkey" FOREIGN KEY ("claimsId") REFERENCES "claims"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
