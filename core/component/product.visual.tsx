import { palette } from "@/core/constant/home.constant";

interface ProductVisualProps {
  shadeHex: string;
  volume: string;
}

export default function ProductVisual({ shadeHex, volume }: ProductVisualProps) {
  return (
    <div className='relative w-28 flex flex-col items-center'>
      <div className='w-[52px] h-8 rounded-t-xl shadow-inner z-10' style={{ backgroundColor: shadeHex }} />
      <div className='w-[68px] h-40 rounded-2xl -mt-1 flex items-end justify-center pb-4 shadow-lg' style={{ backgroundColor: palette.cream, border: `1px solid ${palette.softTaupe}` }}>
        <div className='w-4 h-4 rounded-full ring-1 ring-offset-2 ring-offset-[#F8F1E9] ring-[#C9A99A]/60' style={{ backgroundColor: shadeHex }} />
      </div>
      <div className='absolute top-0 right-0 text-[9px] tracking-[3px] text-[#A17E65]/60 font-light translate-x-6 -translate-y-2'>{volume}</div>
    </div>
  );
}