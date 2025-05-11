-- CreateTable
CREATE TABLE "health" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "health_pkey" PRIMARY KEY ("id")
);
