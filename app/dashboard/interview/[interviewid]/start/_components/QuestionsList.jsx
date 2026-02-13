"use client";
import { Lightbulb, Volume2 } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

function QuestionsList({mockinterviewquestions, activequestionindex}) {
    const texttoSpeech = (text) => {
        if ('speechSynthesis' in window) {
            const speech = new SpeechSynthesisUtterance(text);
            const voices = window.speechSynthesis.getVoices();
            const femaleVoice = voices.find(voice => voice.name.includes('Female') || voice.gender === 'female');
            if (femaleVoice) speech.voice = femaleVoice;
            window.speechSynthesis.speak(speech);
        } else {
            toast.error('Your browser does not support text-to-speech. You can still read the question above.');
        }
    }

    if (!mockinterviewquestions || !Array.isArray(mockinterviewquestions) || mockinterviewquestions.length === 0) {
        return null;
    }
    
  return (
    <div className='bg-white/80 backdrop-blur-xl p-6 rounded-[24px] border-2 border-[#e5d5c8] shadow-soft'>
        {/* Progress chips */}
        <div className='flex items-center gap-3 mb-4'>
            <div className='flex flex-wrap gap-1.5'>
                {mockinterviewquestions.map((question, index) => (
                    <button 
                        key={index}
                        className={`
                            w-8 h-8 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer
                            ${activequestionindex === index 
                                ? 'bg-[#2d5f5f] text-white shadow-soft scale-110' 
                                : 'bg-[#f5ebe0] text-[#1f2937] hover:bg-[#f4cdb8]'
                            }
                        `}
                    >
                        {index+1}
                    </button>
                ))}
            </div>
        </div>
        
        {/* Active question */}
        <div className='flex items-start justify-between gap-3'>
            <div className='flex-1'>
                <h4 className='text-xs font-medium text-[#4a6b5b] mb-1.5'>Question {activequestionindex + 1}</h4>
                <p className='text-base md:text-lg font-medium text-[#1a4d4d] leading-relaxed'>
                    {mockinterviewquestions[activequestionindex]?.question}
                </p>
            </div>
            <button 
                onClick={() => texttoSpeech(mockinterviewquestions[activequestionindex]?.question)}
                className='w-10 h-10 bg-[#f5ebe0] rounded-full flex items-center justify-center hover:bg-[#e5d5c8] transition-all duration-300 group flex-shrink-0'
                title='Listen to question'
            >
                <Volume2 className='w-4 h-4 text-[#2d5f5f] group-hover:scale-110 transition-transform' />
            </button>
        </div>
        
        {/* Note */}
        <div className='mt-4 flex items-start gap-2 bg-[#f4cdb8]/20 rounded-[14px] px-4 py-3 border border-[#e8b4a8]/30'>
            <Lightbulb className='w-4 h-4 text-[#e8b4a8] mt-0.5 flex-shrink-0' />
            <p className='text-xs text-[#4b5563] leading-relaxed'>{process.env.NEXT_PUBLIC_INFO2}</p>
        </div>
    </div>
  )
}

export default QuestionsList