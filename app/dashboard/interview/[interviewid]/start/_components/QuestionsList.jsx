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
    <div className='bg-white/80 backdrop-blur-xl p-8 rounded-[32px] border-2 border-[#e5d5c8] shadow-soft'>
        {/* Progress chips */}
        <div className='mb-6'>
            <h3 className='text-sm font-medium text-[#6b7280] uppercase tracking-wide mb-3'>Interview Progress</h3>
            <div className='flex flex-wrap gap-2'>
                {mockinterviewquestions.map((question, index) => (
                    <button 
                        key={index}
                        className={`
                            px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer
                            ${activequestionindex === index 
                                ? 'bg-[#2d5f5f] text-white shadow-soft scale-105' 
                                : 'bg-[#f5ebe0] text-[#1f2937] hover:bg-[#f4cdb8]'
                            }
                        `}
                    >
                        Q{index+1}
                    </button>
                ))}
            </div>
        </div>
        
        {/* Active question */}
        <div className='bg-gradient-to-br from-[#f5ebe0] to-[#faf6f1] p-6 rounded-[24px] border-2 border-[#e5d5c8] mb-6'>
            <div className='flex items-start justify-between'>
                <div className='flex-1'>
                    <h4 className='text-sm font-medium text-[#4a6b5b] mb-2'>Question {activequestionindex + 1}</h4>
                    <p className='text-lg md:text-xl font-medium text-[#1a4d4d] leading-relaxed'>
                        {mockinterviewquestions[activequestionindex]?.question}
                    </p>
                </div>
                <button 
                    onClick={() => texttoSpeech(mockinterviewquestions[activequestionindex]?.question)}
                    className='ml-4 w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-[#f5ebe0] transition-all duration-300 shadow-soft hover:shadow-md group flex-shrink-0'
                    title='Listen to question'
                >
                    <Volume2 className='w-5 h-5 text-[#2d5f5f] group-hover:scale-110 transition-transform' />
                </button>
            </div>
        </div>
        
        {/* Note */}
        <div className='bg-gradient-to-br from-[#f4cdb8]/40 to-[#f5ddd1]/40 p-5 rounded-[20px] border-2 border-[#e8b4a8]/60'>
            <div className='flex items-start space-x-3'>
                <div className='w-8 h-8 bg-[#e8b4a8] rounded-[10px] flex items-center justify-center flex-shrink-0'>
                    <Lightbulb className='w-4 h-4 text-white' />
                </div>
                <div>
                    <h4 className='font-medium text-[#1a4d4d] mb-1'>Note</h4>
                    <p className='text-sm text-[#4b5563] leading-relaxed font-light'>{process.env.NEXT_PUBLIC_INFO2}</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default QuestionsList