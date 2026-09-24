-- CreateTable
CREATE TABLE "ClinicalCase" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "specialty" TEXT NOT NULL,
    "difficulty" INTEGER NOT NULL DEFAULT 1,
    "estimatedMinutes" INTEGER NOT NULL DEFAULT 15,
    "patientName" TEXT NOT NULL,
    "patientAge" INTEGER NOT NULL,
    "patientSex" TEXT NOT NULL,
    "openingStatement" TEXT NOT NULL,
    "caseData" JSONB NOT NULL,
    "rubric" JSONB NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClinicalCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaseSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'in_progress',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "messageCount" INTEGER NOT NULL DEFAULT 0,
    "durationSeconds" INTEGER,
    "transcript" JSONB NOT NULL DEFAULT '[]',
    "evaluation" JSONB,
    "overallScore" INTEGER,
    "anamnesisScore" INTEGER,
    "languageScore" INTEGER,
    "communicationScore" INTEGER,

    CONSTRAINT "CaseSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSkill" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "skillKey" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "successes" INTEGER NOT NULL DEFAULT 0,
    "lastPracticed" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSkill_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClinicalCase_slug_key" ON "ClinicalCase"("slug");

-- CreateIndex
CREATE INDEX "ClinicalCase_isPublished_specialty_idx" ON "ClinicalCase"("isPublished", "specialty");

-- CreateIndex
CREATE INDEX "CaseSession_userId_status_idx" ON "CaseSession"("userId", "status");

-- CreateIndex
CREATE INDEX "CaseSession_caseId_idx" ON "CaseSession"("caseId");

-- CreateIndex
CREATE UNIQUE INDEX "UserSkill_userId_skillKey_key" ON "UserSkill"("userId", "skillKey");

-- AddForeignKey
ALTER TABLE "CaseSession" ADD CONSTRAINT "CaseSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseSession" ADD CONSTRAINT "CaseSession_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "ClinicalCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSkill" ADD CONSTRAINT "UserSkill_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
