/*
  Warnings:

  - Added the required column `status` to the `rules` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "rules" ADD COLUMN     "status" VARCHAR(64) NOT NULL;
