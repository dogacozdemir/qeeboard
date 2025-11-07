-- CreateTable
CREATE TABLE "UserSavedColor" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "color" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserSavedColor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserSavedColor_userId_idx" ON "UserSavedColor"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserSavedColor_userId_color_key" ON "UserSavedColor"("userId", "color");

-- AddForeignKey
ALTER TABLE "UserSavedColor" ADD CONSTRAINT "UserSavedColor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
