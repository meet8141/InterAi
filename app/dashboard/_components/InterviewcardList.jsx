import { Button } from '@/components/ui/button'
import React from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, Briefcase, ArrowRight, BarChart3 } from 'lucide-react'

function InterviewcardList({interview}) {
    const router = useRouter();

  return (
    <div className='group bg-white/80 backdrop-blur-xl border-2 border-[#e5d5c8] rounded-[40px] p-8 hover:bg-white/95 hover:shadow-lg hover:border-[#4a6b5b] transition-all duration-500 transform hover:-translate-y-3 hover:scale-105'>
        <div className='space-y-4'>
            <div className='flex items-start justify-between'>
                <div className='flex-1'>
                    <h2 className='text-xl font-display font-normal text-[#1a4d4d] group-hover:text-[#2d5f5f] transition-colors line-clamp-2'>
                        {interview?.jobposition}
                    </h2>
                </div>
                <div className='w-12 h-12 bg-gradient-to-br from-[#2d5f5f] to-[#4a6b5b] rounded-[40%_60%_50%_50%/60%_40%_60%_40%] flex items-center justify-center group-hover:scale-110 transition-transform duration-300'>
                    <Briefcase className='w-6 h-6 text-white' />
                </div>
            </div>
            
            <div className='space-y-2'>
                <div className='flex items-center text-sm text-[#4b5563]'>
                    <BarChart3 className='w-4 h-4 mr-2 text-[#4a6b5b]' />
                    <span className='font-medium'>{interview?.jobexp}</span>
                    <span className='ml-1 font-light'>Years Experience</span>
                </div>
                <div className='flex items-center text-sm text-[#6b7280] font-light'>
                    <Calendar className='w-4 h-4 mr-2 text-[#4a6b5b]' />
                    <span>Created: {interview?.createdat?.slice(0, 10)}</span>
                </div>
            </div>
        </div>

        <div className='flex gap-3 mt-6 pt-4 border-t border-[#f0e6db]'> 
            <Button 
                size="sm" 
                variant="outline" 
                className="flex-1 h-10 border-[#e5d5c8] hover:border-[#4a6b5b] hover:bg-[#f5ebe0] hover:text-[#2d5f5f] font-medium rounded-[20px] transition-all duration-300"
                onClick={() => router.push(`/dashboard/interview/${interview?.mockid}/feedback`)}
            >
                Feedback
            </Button>
            <Button 
                size="sm" 
                className="flex-1 h-10 bg-[#2d5f5f] hover:bg-[#1a4d4d] text-white font-medium rounded-[20px] shadow-soft hover:shadow-md transition-all duration-300 group"
                onClick={() => router.push(`/dashboard/interview/${interview?.mockid}/start`)}
            >
                <span>Start</span>
                <ArrowRight className='ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform' />
            </Button>
        </div>
    </div>
  )
}

export default InterviewcardList