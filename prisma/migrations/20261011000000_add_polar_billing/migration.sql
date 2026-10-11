-- Add Polar identifiers without dropping Paddle columns or touching user data.
ALTER TABLE "Subscription" ADD COLUMN "polarCustomerId" TEXT;
ALTER TABLE "Subscription" ADD COLUMN "polarSubscriptionId" TEXT;
CREATE UNIQUE INDEX "Subscription_polarSubscriptionId_key" ON "Subscription"("polarSubscriptionId");
