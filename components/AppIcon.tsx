import type { SVGProps, ReactNode } from 'react';

type Name = 'home'|'book'|'stethoscope'|'clipboard'|'alert'|'search'|'user'|'settings'|'arrow'|'check'|'x'|'clock'|'chart'|'target'|'chevron';
const paths: Record<Name, ReactNode> = {
  home:<><path d="m3 10 9-7 9 7"/><path d="M5 9v11h14V9"/><path d="M9 20v-6h6v6"/></>,
  book:<><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 1 4 17.5z"/><path d="M4 17.5A2.5 2.5 0 0 1 6.5 15H20"/></>,
  stethoscope:<><path d="M6 3v5a4 4 0 0 0 8 0V3"/><path d="M4 3h4M12 3h4"/><path d="M10 12v3a5 5 0 0 0 10 0v-1"/><circle cx="20" cy="12" r="2"/></>,
  clipboard:<><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4.5V3h6v1.5M8 10h8M8 14h6"/></>,
  alert:<><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></>,
  search:<><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
  user:<><circle cx="12" cy="8" r="3"/><path d="M5 21a7 7 0 0 1 14 0"/></>,
  settings:<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.7 1.7-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V20h-2.4v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1-1.7-1.7.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H6v-2.4h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1L9 7l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5V5h2.4v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1L19 8l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.2v2.4h-.2a1.7 1.7 0 0 0-1.5 1Z"/></>,
  arrow:<><path d="M5 12h13"/><path d="m13 6 6 6-6 6"/></>,
  check:<path d="m5 12 4 4L19 6"/>,
  x:<><path d="m6 6 12 12M18 6 6 18"/></>,
  clock:<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  chart:<><path d="M5 19V9M12 19V5M19 19v-7"/></>,
  target:<><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 2v3M22 12h-3M12 22v-3M2 12h3"/></>,
  chevron:<path d="m9 18 6-6-6-6"/>,
};

export function AppIcon({name,size=18,strokeWidth=1.8,className,...props}:{name:Name;size?:number;strokeWidth?:number;className?:string}&SVGProps<SVGSVGElement>){
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className} {...props}>{paths[name]}</svg>;
}
