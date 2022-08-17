/*
  Warnings:

  - You are about to drop the column `entryHttpMethod` on the `routes` table. All the data in the column will be lost.
  - You are about to drop the column `outHttpMethod` on the `routes` table. All the data in the column will be lost.
  - Added the required column `entry_http_method` to the `routes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `out_http_method` to the `routes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "routes" DROP COLUMN "entryHttpMethod",
DROP COLUMN "outHttpMethod",
ADD COLUMN     "entry_http_method" VARCHAR(8) NOT NULL,
ADD COLUMN     "out_http_method" VARCHAR(8) NOT NULL;
