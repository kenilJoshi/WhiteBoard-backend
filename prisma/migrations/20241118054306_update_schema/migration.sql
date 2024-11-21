-- CreateTable
CREATE TABLE "WhiteBoard" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "imageData" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WhiteBoard_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WhiteBoard" ADD CONSTRAINT "WhiteBoard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
