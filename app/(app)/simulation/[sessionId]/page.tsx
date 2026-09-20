import { notFound, redirect } from 'next/navigation';
import { getCurrentUserId } from '@/lib/session';
import { getSessionForUser } from '@/lib/simulation';
import { SimulationChat } from './SimulationChat';
import type { TranscriptEntry } from '@/lib/ai/patient';

export default async function SimulationPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  const userId = (await getCurrentUserId())!;
  const session = await getSessionForUser(sessionId, userId);
  if (!session) notFound();
  if (session.status === 'completed') redirect(`/simulation/${sessionId}/results`);

  const transcript = session.transcript as unknown as TranscriptEntry[];

  return (
    <SimulationChat
      sessionId={sessionId}
      caseTitle={session.case.title}
      patientName={session.case.patientName}
      patientAge={session.case.patientAge}
      initialTranscript={transcript}
    />
  );
}
