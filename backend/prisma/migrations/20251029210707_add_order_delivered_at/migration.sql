-- AlterTable
ALTER TABLE "Order" ADD COLUMN "deliveredAt" TIMESTAMP(3),
ADD COLUMN "updatedAt" TIMESTAMP(3);

-- Update existing rows: set updatedAt to createdAt
UPDATE "Order" SET "updatedAt" = "createdAt" WHERE "updatedAt" IS NULL;

-- Make updatedAt NOT NULL after updating existing rows
ALTER TABLE "Order" ALTER COLUMN "updatedAt" SET NOT NULL;
