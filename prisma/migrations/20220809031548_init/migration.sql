-- CreateTable
CREATE TABLE "secrets" (
    "id" VARCHAR(36) NOT NULL,
    "token" VARCHAR(128) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL,
    "expires_in" TIMESTAMPTZ NOT NULL,
    "type" VARCHAR(128) NOT NULL,
    "revoked" BOOLEAN NOT NULL,

    CONSTRAINT "secrets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" VARCHAR(36) NOT NULL,
    "email" VARCHAR(512) NOT NULL,
    "nickname" VARCHAR(32) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "name" VARCHAR(512) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "claims" (
    "id" VARCHAR(36) NOT NULL,
    "name" VARCHAR(512) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "claims_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rules" (
    "id" VARCHAR(36) NOT NULL,
    "match" VARCHAR(256) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,

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
