import { Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <header className="rounded-3xl bg-[#d6ebbb] border-2 border-black px-5 sm:px-8 py-3 sm:py-4 flex items-center justify-between shadow-[6px_6px_0_0_#000]">
      <div className="flex items-center gap-3">
        <Mascot />
        <span className="font-display text-2xl sm:text-3xl tracking-tight text-black">
          TAITOR
        </span>
      </div>
      <nav className="hidden sm:flex items-center gap-1 text-sm font-medium">
        <span className="px-4 py-2 rounded-full bg-black text-white">My Tutor</span>
        <span className="px-4 py-2 rounded-full text-neutral-700">Lessons</span>
        <span className="px-4 py-2 rounded-full text-neutral-700">Settings</span>
      </nav>
      <span className="sm:hidden inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-black text-white text-xs font-medium">
        <Sparkles className="w-3.5 h-3.5" /> Tutor
      </span>
    </header>
  );
}

function Mascot() {
  return (
    <div
      className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white border-2 border-black flex items-center justify-center shadow-[3px_3px_0_0_#000]"
      aria-hidden="true"
    >
      <svg viewBox="0 0 40 40" className="w-7 h-7 sm:w-8 sm:h-8">
        <circle cx="20" cy="22" r="13" fill="#fbd6df" stroke="black" strokeWidth="2" />
        <circle cx="15" cy="22" r="2" fill="black" />
        <circle cx="25" cy="22" r="2" fill="black" />
        <path d="M14 28 Q20 32 26 28" stroke="black" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M10 14 L7 9 M30 14 L33 9" stroke="black" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
}
