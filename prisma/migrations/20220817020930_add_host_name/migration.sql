/*
  Warnings:

  - You are about to drop the column `target` on the `routes` table. All the data in the column will be lost.
  - Added the required column `target_host` to the `routes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `target_path` to the `routes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "routes" DROP COLUMN "target",
ADD COLUMN     "target_host" VARCHAR(1024) NOT NULL,
ADD COLUMN     "target_path" VARCHAR(1024) NOT NULL;
