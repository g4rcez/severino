-- CreateTable
CREATE TABLE "secrets" (
    "id" UUID NOT NULL,
    "token" VARCHAR(128) NOT NULL,
    "created_at" TIMESTAMP NOT NULL,
    "expires_in" TIMESTAMP NOT NULL,
    "type" VARCHAR(128) NOT NULL,
    "revoked" BOOLEAN NOT NULL,
    CONSTRAINT "secrets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" uuid NOT NULL,
    "email" VARCHAR(512) NOT NULL,
    "nickname" VARCHAR(32) NOT NULL,
    "created_at" TIMESTAMP NOT NULL,
    "updated_at" TIMESTAMP NOT NULL,
    "name" VARCHAR(512) NOT NULL,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "claims" (
    "id" UUID NOT NULL,
    "name" VARCHAR(512) NOT NULL,
    "created_at" TIMESTAMP NOT NULL,
    "updated_at" TIMESTAMP NOT NULL,
    CONSTRAINT "claims_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rules" (
    "id" UUID NOT NULL,
    "match" VARCHAR(256) NOT NULL,
    "created_at" TIMESTAMP NOT NULL,
    "updated_at" TIMESTAMP NOT NULL,
    CONSTRAINT "rules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_nickname_key" ON "users"("nickname");

-- CreateIndex
CREATE UNIQUE INDEX "claims_name_key" ON "claims"("name");

-- CreateIndex
CREATE UNIQUE INDEX "rules_match_key" ON "rules"("match");