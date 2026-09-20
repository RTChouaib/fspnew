import { getCurrentUserId } from '@/lib/session';
import { getSessionForUser, appendTurn } from '@/lib/simulation';
import { getCaseForSimulation } from '@/lib/cases';
import { generatePatientResponse, type TranscriptEntry } from '@/lib/ai/patient';
import { checkRateLimit } from '@/lib/ai/rateLimit';
import { MAX_USER_MESSAGE_LENGTH, MAX_TRANSCRIPT_MESSAGES } from '@/lib/ai/schemas';

export async function POST(req: Request, { params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;

  const userId = await getCurrentUserId();
  if (!userId) return new Response('Unauthorized', { status: 401 });

  if (!checkRateLimit(`sim-message:${userId}`)) {
    return new Response('Zu viele Anfragen — bitte kurz warten.', { status: 429 });
  }

  // 404, not 403, whether the session doesn't exist or belongs to someone
  // else — never reveal which.
  const session = await getSessionForUser(sessionId, userId);
  if (!session) return new Response('Not found', { status: 404 });

  if (session.status !== 'in_progress') {
    return new Response('Diese Simulation ist bereits beendet.', { status: 400 });
  }

  const body = await req.json().catch(() => null);
  const message = typeof body?.message === 'string' ? body.message.trim() : '';
  if (!message || message.length > MAX_USER_MESSAGE_LENGTH) {
    return new Response('Ungültige Nachricht.', { status: 400 });
  }

  const transcript = session.transcript as unknown as TranscriptEntry[];
  if (transcript.length >= MAX_TRANSCRIPT_MESSAGES) {
    return new Response('Diese Simulation hat die maximale Länge erreicht.', { status: 400 });
  }

  const caseRecord = await getCaseForSimulation(session.caseId);
  if (!caseRecord) return new Response('Case not found', { status: 404 });

  let patientReply;
  try {
    patientReply = await generatePatientResponse(
      {
        patientName: caseRecord.patientName,
        patientAge: caseRecord.patientAge,
        patientSex: caseRecord.patientSex,
        caseData: caseRecord.caseData as Record<string, unknown>,
      },
      transcript,
      message
    );
  } catch (err) {
    console.error('[simulation/message] patient AI failed', err);
    return new Response(
      'Der simulierte Patient konnte nicht antworten. Bitte versuche es erneut.',
      { status: 502 }
    );
  }

  const doctorEntry: TranscriptEntry = { role: 'doctor', content: message };
  const patientEntry: TranscriptEntry = { role: 'patient', content: patientReply.message };
  const updatedTranscript = [...transcript, doctorEntry, patientEntry];

  await appendTurn(sessionId, updatedTranscript);

  return Response.json({ message: patientReply.message, emotion: patientReply.emotion });
}
