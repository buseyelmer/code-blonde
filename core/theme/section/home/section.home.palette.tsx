"use client";

import { NUDE_TONES } from "@/core/constant/home.constant";

interface PaletteProps {
  selectedTone: number | null;
  setSelectedTone: (index: number | null) => void;
}

export default function SectionHomePalette({ selectedTone, setSelectedTone }: PaletteProps) {
  return (
    <section id='tonlar' className='max-w-6xl mx-auto px-8 py-24'>
      <div className='text-center mb-14'>
        <p className='text-[10px] tracking-[4px] text-[#A17E65]'>THE PALETTE</p>
        <h3 className='font-serif text-5xl tracking-[-1.5px] mt-2 text-[#5C4638]'>Nude&apos;un 40 Tonu</h3>
        <p className='mt-3 text-[#8B6B57]'>Her tenin kendine ait bir nüansı vardır. Aşağıda en ikonik olanları keşfedin.</p>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3'>
        {(NUDE_TONES ?? []).map((tone, i) => (
          <button
            key={i}
            onClick={() => setSelectedTone(selectedTone === i ? null : i)}
            className={`group aspect-[1.65] rounded-2xl flex flex-col justify-end p-5 border transition-all text-left ${
              selectedTone === i ? "border-[#5C4638] ring-2 ring-[#5C4638]/20" : "border-[#D9C5B0] hover:border-[#A17E65]"
            }`}
            style={{ backgroundColor: tone.hex }}>
            <div className={`text-[13px] font-light tracking-wide group-hover:tracking-widest transition-all ${tone.tone === "Açık" ? "text-[#5C4638]" : "text-white"}`}>{tone.name}</div>
            <div className={`font-mono text-[10px] mt-px tracking-[1px] ${tone.tone === "Açık" ? "text-[#5C4638]/50" : "text-white/60"}`}>{tone.hex}</div>
          </button>
        ))}
      </div>

      <div className='text-center mt-9 text-xs text-[#A17E65] tracking-[3px]'>HER TON, GERÇEK CİLTTE TEST EDİLDİ</div>
    </section>
  );
}
