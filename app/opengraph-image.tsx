import { ImageResponse } from 'next/og';

export const alt = 'FSP Terminology: Medizinisches Deutsch für die Fachsprachprüfung';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '72px',
        background: 'linear-gradient(135deg, #f5f6f3 0%, #e4edff 100%)',
        color: '#16232e',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 34, fontWeight: 700 }}>
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: 9,
            background: '#1d4ed8',
          }}
        />
        FSP Terminology
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>
          Dein FSP-Training. Schritt für Schritt.
        </div>
        <div style={{ fontSize: 34, color: '#46566a', maxWidth: 900 }}>
          Fachsprache und Patientensprache lernen, Patientengespräche üben, Schwächen erkennen.
        </div>
      </div>
      <div style={{ fontSize: 28, color: '#1d4ed8', fontWeight: 700 }}>5 Aufgaben kostenlos testen</div>
    </div>,
    size
  );
}
