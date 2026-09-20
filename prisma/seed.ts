import { PrismaClient } from '@prisma/client';
import { CASE_SEEDS } from './seedCases';

const prisma = new PrismaClient();

async function main() {
  for (const c of CASE_SEEDS) {
    await prisma.clinicalCase.upsert({
      where: { slug: c.slug },
      update: {
        title: c.title,
        specialty: c.specialty,
        difficulty: c.difficulty,
        estimatedMinutes: c.estimatedMinutes,
        patientName: c.patientName,
        patientAge: c.patientAge,
        patientSex: c.patientSex,
        openingStatement: c.openingStatement,
        caseData: c.caseData,
        rubric: c.rubric,
        isPublished: true,
      },
      create: {
        slug: c.slug,
        title: c.title,
        specialty: c.specialty,
        difficulty: c.difficulty,
        estimatedMinutes: c.estimatedMinutes,
        patientName: c.patientName,
        patientAge: c.patientAge,
        patientSex: c.patientSex,
        openingStatement: c.openingStatement,
        caseData: c.caseData,
        rubric: c.rubric,
        isPublished: true,
      },
    });
    console.log(`Seeded case: ${c.slug}`);
  }
  console.log(`Done — ${CASE_SEEDS.length} cases seeded.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
