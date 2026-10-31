import type { Metadata } from 'next';
import { TERMS, termById } from '@/data/terms';
import { buildQuestion } from '@/lib/quiz';
import { MarketingTopBar } from '@/components/MarketingTopBar';
import { MarketingFooter } from '@/components/MarketingFooter';
import { DemoQuiz } from './DemoQuiz';

const DEMO_TERM_IDS = ['t001', 't012', 't021', 't031', 't044'];

export const metadata: Metadata = {
  title: '5 Aufgaben kostenlos testen',
  description: 'Probiere 5 echte Aufgaben aus FSP Terminology aus, ohne Konto und ohne Zahlungsdaten.',
  alternates: { canonical: '/demo' },
};

export default function DemoPage() {
  const questions = DEMO_TERM_IDS.map((id) => buildQuestion(termById(id)!, 'medToPatient', TERMS));

  return (
    <>
      <MarketingTopBar />
      <div className="wrap narrow" style={{ paddingTop: 36 }}>
        <h1 className="page-display">5 Aufgaben kostenlos testen</h1>
        <DemoQuiz questions={questions} />
      </div>
      <MarketingFooter />
    </>
  );
}
