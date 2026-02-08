"use client";
import React, { useEffect, useState } from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, Trophy, Star, MessageSquare, CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

function Feedback({ params }) {
  const [feedbackData, setFeedbackData] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const router = useRouter();

  useEffect(() => {
    GetInterviewData();
  }, []);

  const GetInterviewData = async () => {
    const response = await fetch(`/api/feedback/${params.interviewid}`);
    if (!response.ok) {
      console.error("Failed to fetch feedback");
      return;
    }
    const result = await response.json();
    setFeedbackData(result);
    calculateAverageRating(result);
  };

  const calculateAverageRating = (data) => {
    if (data.length > 0) {
      const totalRating = data.reduce((sum, item) => {
        const rating = parseFloat(item.rating) || 0;
        return sum + rating;
      }, 0);
      const average = totalRating / data.length;
      setAverageRating(average.toFixed(1));
    }
  };

  const getRatingColor = (rating) => {
    const r = parseFloat(rating) || 0;
    if (r >= 8) return 'text-[#4a6b5b]';
    if (r >= 5) return 'text-[#2d5f5f]';
    return 'text-[#b91c1c]';
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-[#faf6f1] via-[#f5ebe0] to-white relative'>
      {/* Decorative blurs */}
      <div className='absolute top-20 right-10 w-72 h-72 bg-[#c5d5d0] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float pointer-events-none' />
      <div className='absolute bottom-20 left-10 w-96 h-96 bg-[#f4cdb8] rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none' style={{animationDelay: '2s'}} />

      <div className='relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8'>
        {/* Header */}
        <div className='bg-white/80 backdrop-blur-xl rounded-[32px] p-8 shadow-soft border-2 border-[#e5d5c8] text-center space-y-4'>
          <div className='w-20 h-20 mx-auto bg-gradient-to-br from-[#4a6b5b] to-[#2d4a3d] rounded-[40%_60%_50%_50%/60%_40%_60%_40%] flex items-center justify-center shadow-soft'>
            <Trophy className='w-10 h-10 text-white' />
          </div>

          {feedbackData.length === 0 ? (
            <>
              <h1 className='text-3xl font-display font-normal text-[#1a4d4d]'>No Feedback Yet</h1>
              <p className='text-[#6b7280] font-light'>Complete an interview to see your detailed feedback here.</p>
            </>
          ) : (
            <>
              <h1 className='text-3xl md:text-4xl font-display font-normal text-[#1a4d4d]'>Congratulations!</h1>
              <p className='text-[#4b5563] text-lg font-light'>Here's your thoughtful interview feedback</p>

              {/* Overall rating */}
              <div className='inline-flex items-center gap-3 bg-[#f5ebe0] px-6 py-3 rounded-full border-2 border-[#e5d5c8]'>
                <Star className='w-6 h-6 text-[#e8b4a8] fill-current' />
                <span className='text-2xl font-display font-normal text-[#1a4d4d]'>{averageRating}<span className='text-base text-[#6b7280]'>/10</span></span>
                <span className='text-sm text-[#6b7280] font-light'>Overall Rating</span>
              </div>
            </>
          )}
        </div>

        {/* Feedback cards */}
        {feedbackData.length > 0 && (
          <div className='space-y-4'>
            <h2 className='text-xl font-medium text-[#1a4d4d]'>Question-by-Question Breakdown</h2>

            {feedbackData.map((data, index) => (
              <Collapsible key={index}>
                <CollapsibleTrigger className='w-full bg-white/80 backdrop-blur-xl rounded-[20px] p-5 shadow-soft border-2 border-[#e5d5c8] hover:border-[#4a6b5b] hover:shadow-md transition-all duration-300 text-left flex items-center justify-between gap-4 group'>
                  <div className='flex items-center gap-3 flex-1 min-w-0'>
                    <span className='flex-shrink-0 w-8 h-8 rounded-full bg-[#2d5f5f] text-white text-sm font-semibold flex items-center justify-center'>
                      {index + 1}
                    </span>
                    <span className='text-[#1a4d4d] font-medium truncate'>{data.question}</span>
                  </div>
                  <div className='flex items-center gap-3 flex-shrink-0'>
                    <span className={`font-display font-semibold text-lg ${getRatingColor(data.rating)}`}>
                      {data.rating}/10
                    </span>
                    <ChevronDown className='w-5 h-5 text-[#6b7280] group-data-[state=open]:rotate-180 transition-transform duration-300' />
                  </div>
                </CollapsibleTrigger>

                <CollapsibleContent className='mt-2 space-y-3 px-2'>
                  {/* Your answer */}
                  <div className='bg-[#fef2f2] border-2 border-[#fecaca] rounded-[16px] p-4'>
                    <div className='flex items-center gap-2 mb-2'>
                      <XCircle className='w-4 h-4 text-[#b91c1c]' />
                      <span className='text-sm font-medium text-[#b91c1c]'>Your Answer</span>
                    </div>
                    <p className='text-sm text-[#7f1d1d] leading-relaxed'>{data.useranswer}</p>
                  </div>

                  {/* Correct answer */}
                  <div className='bg-[#f0fdf4] border-2 border-[#bbf7d0] rounded-[16px] p-4'>
                    <div className='flex items-center gap-2 mb-2'>
                      <CheckCircle2 className='w-4 h-4 text-[#4a6b5b]' />
                      <span className='text-sm font-medium text-[#4a6b5b]'>Ideal Answer</span>
                    </div>
                    <p className='text-sm text-[#14532d] leading-relaxed text-justify'>{data.correctanswer}</p>
                  </div>

                  {/* Feedback */}
                  <div className='bg-[#f5ebe0] border-2 border-[#e5d5c8] rounded-[16px] p-4'>
                    <div className='flex items-center gap-2 mb-2'>
                      <MessageSquare className='w-4 h-4 text-[#2d5f5f]' />
                      <span className='text-sm font-medium text-[#2d5f5f]'>Feedback</span>
                    </div>
                    <p className='text-sm text-[#1a4d4d] leading-relaxed text-justify'>{data.feedback}</p>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        )}

        {/* Back button */}
        <div className='flex justify-center pt-4'>
          <Button
            onClick={() => router.replace('/dashboard')}
            className='rounded-[28px] bg-[#2d5f5f] hover:bg-[#1a4d4d] text-white font-medium px-8 py-3 shadow-soft hover:shadow-md transition-all duration-300'
          >
            <ArrowLeft className='w-4 h-4 mr-2' />
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Feedback;
