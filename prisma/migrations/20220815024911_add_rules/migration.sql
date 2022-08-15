/*
  Warnings:

  - You are about to drop the column `match` on the `rules` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[routes]` on the table `rules` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[claims]` on the table `rules` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `claims` to the `rules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `routes` to the `rules` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "rules_match_key";

-- AlterTable
ALTER TABLE "rules" DROP COLUMN "match",
ADD COLUMN     "claims" VARCHAR(512) NOT NULL,
ADD COLUMN     "routes" VARCHAR(512) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "rules_routes_key" ON "rules"("routes");

-- CreateIndex
CREATE UNIQUE INDEX "rules_claims_key" ON "rules"("claims");
