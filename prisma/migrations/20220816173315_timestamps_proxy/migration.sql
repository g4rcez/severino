/*
  Warnings:

  - Added the required column `created_at` to the `routes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deleted_at` to the `routes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `routes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "routes" ADD COLUMN     "created_at" TIMESTAMP NOT NULL,
ADD COLUMN     "deleted_at" TIMESTAMP NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP NOT NULL;
