/*
  Warnings:

  - You are about to drop the column `claims` on the `rules` table. All the data in the column will be lost.
  - You are about to drop the column `routes` on the `rules` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[route]` on the table `rules` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[claim]` on the table `rules` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `claim` to the `rules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `httpMethod` to the `rules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `metadata` to the `rules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `route` to the `rules` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "rules_claims_key";

-- DropIndex
DROP INDEX "rules_routes_key";

-- AlterTable
ALTER TABLE "rules" DROP COLUMN "claims",
DROP COLUMN "routes",
ADD COLUMN     "claim" VARCHAR(512) NOT NULL,
ADD COLUMN     "httpMethod" VARCHAR(8) NOT NULL,
ADD COLUMN     "metadata" JSONB NOT NULL,
ADD COLUMN     "route" VARCHAR(512) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "rules_route_key" ON "rules"("route");

-- CreateIndex
CREATE UNIQUE INDEX "rules_claim_key" ON "rules"("claim");
