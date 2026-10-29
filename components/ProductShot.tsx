import fs from 'node:fs';
import path from 'node:path';
import Image from 'next/image';
import type { ReactNode } from 'react';

/**
 * Shows a real screenshot from /public/screenshots/<name> when the file exists.
 * Until then, the labelled example mock-up passed as children is rendered instead.
 * (Drop PNG/WebP files into public/screenshots to replace the mock-ups. No code change needed.)
 */
export function ProductShot({
  name,
  alt,
  width,
  height,
  children,
}: {
  name: string;
  alt: string;
  width: number;
  height: number;
  children: ReactNode;
}) {
  const file = path.join(process.cwd(), 'public', 'screenshots', name);
  if (fs.existsSync(file)) {
    return <Image src={`/screenshots/${name}`} alt={alt} width={width} height={height} className="product-shot" />;
  }
  return <>{children}</>;
}
