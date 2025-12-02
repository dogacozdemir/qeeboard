-- AlterTable
ALTER TABLE "ShareLink" ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "visitorCount" INTEGER NOT NULL DEFAULT 0;
