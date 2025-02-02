-- CreateTable
CREATE TABLE "WhatsappLead" (
    "id" SERIAL NOT NULL,
    "phone" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WhatsappLead_pkey" PRIMARY KEY ("id")
);
