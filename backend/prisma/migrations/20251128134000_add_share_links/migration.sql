-- CreateEnum
CREATE TYPE "ShareRole" AS ENUM ('VIEWER', 'EDITOR');

-- CreateTable
CREATE TABLE "ShareLink" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "configId" INTEGER NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "allowedEmails" JSONB NOT NULL,
    "role" "ShareRole" NOT NULL DEFAULT 'VIEWER',
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShareLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShareLink_token_key" ON "ShareLink"("token");

-- CreateIndex
CREATE INDEX "ShareLink_token_idx" ON "ShareLink"("token");

-- CreateIndex
CREATE INDEX "ShareLink_configId_idx" ON "ShareLink"("configId");

-- CreateIndex
CREATE INDEX "ShareLink_ownerId_idx" ON "ShareLink"("ownerId");

-- AddForeignKey
ALTER TABLE "ShareLink" ADD CONSTRAINT "ShareLink_configId_fkey" FOREIGN KEY ("configId") REFERENCES "KeyboardConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShareLink" ADD CONSTRAINT "ShareLink_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
