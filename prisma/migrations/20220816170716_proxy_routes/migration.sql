-- CreateTable
CREATE TABLE "routes" (
    "id" UUID NOT NULL,
    "entrypoint" VARCHAR(1024) NOT NULL,
    "target" VARCHAR(1024) NOT NULL,
    "entryHttpMethod" VARCHAR(8) NOT NULL,
    "outHttpMethod" VARCHAR(8) NOT NULL,
    "metadata" JSONB NOT NULL,

    CONSTRAINT "routes_pkey" PRIMARY KEY ("id")
);
