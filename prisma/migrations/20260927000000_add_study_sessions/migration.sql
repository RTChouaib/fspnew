CREATE TABLE "StudySession" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "sessionDate" TIMESTAMP(3) NOT NULL,
  "focusCategory" TEXT NOT NULL,
  "currentStep" INTEGER NOT NULL DEFAULT 0,
  "completedSteps" TEXT[] NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'in_progress',
  "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "completedAt" TIMESTAMP(3),
  CONSTRAINT "StudySession_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "StudySession_userId_sessionDate_key" ON "StudySession"("userId", "sessionDate");
CREATE INDEX "StudySession_userId_status_idx" ON "StudySession"("userId", "status");
ALTER TABLE "StudySession" ADD CONSTRAINT "StudySession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
