"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { Shirt, Sparkles } from 'lucide-react';

function Dressing() {
  const router = useRouter();

  return (
    <div
      className='group relative p-10 border-2 border-dashed border-[#b8a896] rounded-[40px] bg-white/70 backdrop-blur-xl hover:bg-white/90 hover:border-[#4a6b5b] hover:shadow-lg cursor-pointer transition-all duration-500 transform hover:-translate-y-2 hover:scale-105'
      onClick={() => router.push('/dashboard/dressing-posture')}
    >
      <div className='flex flex-col items-center justify-center space-y-4'>
        <div className='w-20 h-20 bg-gradient-to-br from-[#5b4a6b] to-[#7b6b8f] rounded-[40%_60%_50%_50%/60%_40%_60%_40%] flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-soft'>
          <Shirt className='w-9 h-9 text-white' />
        </div>
        <h2 className='text-xl font-medium text-[#1f2937] group-hover:text-[#2d5f5f] transition-colors'>
          Dressing & Posture
        </h2>
        <p className='text-base text-[#6b7280] text-center font-light leading-relaxed'>
          Dress code, body language & confident posture
        </p>
        <div className='flex items-center gap-1.5 text-xs text-[#5b4a6b] font-medium bg-[#f0ebf5] px-3 py-1.5 rounded-full border border-[#ddd5e8]'>
          <Sparkles className='w-3.5 h-3.5' />
          10 Essential Tips & Questions
        </div>
      </div>
    </div>
  );
}

export default Dressing;
