"use client";
import React, { useEffect } from 'react';
import QuestionsList from './_components/QuestionsList';
import RecordAnswerSection from './_components/RecordAnswerSection';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Flag } from 'lucide-react';

function StartInterview({params}) {
    const [interviewdata, setInterviewdata] = React.useState();
    const [mockinterviewquestions, setMockinterviewquestions] = React.useState([]);
    const [activequestionindex, setActivequestionindex] = React.useState(0);

    useEffect(() => {
        dbdata();
    }, []);

    const dbdata = async () => {
        try {
          const response = await fetch(`/api/interviews/${params.interviewid}`);
          if (!response.ok) {
            console.error("Failed to fetch interview data");
            return;
          }
          const result = await response.json();
          const questions = JSON.parse(result.jsonmockresp);
          setMockinterviewquestions(questions);
          setInterviewdata(result);
        } catch (error) {
          console.error("Error fetching interview details:", error);
        }
    };

  return (
    <div className='min-h-screen bg-gradient-to-b from-[#faf6f1] via-[#f5ebe0] to-white relative'>
      {/* Decorative blurs */}
      <div className='absolute top-20 right-10 w-72 h-72 bg-[#c5d5d0] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float pointer-events-none' />
      <div className='absolute bottom-20 left-10 w-96 h-96 bg-[#f4cdb8] rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none' style={{animationDelay: '2s'}} />

      <div className='relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10'>
        {/* Page header */}
        <div>
          <h1 className='text-3xl md:text-4xl font-display font-normal text-[#1a4d4d] mb-2'>Practice Session</h1>
          <p className='text-[#6b7280] text-lg font-light'>
            Question {activequestionindex + 1} of {mockinterviewquestions.length || '…'} — take your time and answer clearly.
          </p>
        </div>

        {/* Main grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-10 items-start'>
          <QuestionsList mockinterviewquestions={mockinterviewquestions} activequestionindex={activequestionindex} />
          <RecordAnswerSection mockinterviewquestions={mockinterviewquestions} activequestionindex={activequestionindex} interviewdata={interviewdata} />
        </div>

        {/* Navigation */}
        <div className='flex justify-end gap-4 pt-6 border-t border-[#f0e6db]'>
          {activequestionindex > 0 && (
            <Button
              variant="outline"
              onClick={() => setActivequestionindex(activequestionindex - 1)}
              className='rounded-[20px] border-[#e5d5c8] hover:border-[#4a6b5b] hover:bg-[#f5ebe0] text-[#1f2937] font-medium transition-all duration-300'
            >
              <ArrowLeft className='w-4 h-4 mr-2' />
              Previous
            </Button>
          )}
          {activequestionindex !== mockinterviewquestions?.length - 1 && (
            <Button
              onClick={() => setActivequestionindex(activequestionindex + 1)}
              className='rounded-[28px] bg-[#2d5f5f] hover:bg-[#1a4d4d] text-white font-medium shadow-soft hover:shadow-md transition-all duration-300'
            >
              Next Question
              <ArrowRight className='w-4 h-4 ml-2' />
            </Button>
          )}
          {activequestionindex === mockinterviewquestions?.length - 1 && (
            <Link href={`/dashboard/interview/${params.interviewid}/feedback`}>
              <Button className='rounded-[28px] bg-[#4a6b5b] hover:bg-[#2d4a3d] text-white font-medium shadow-soft hover:shadow-md transition-all duration-300'>
                <Flag className='w-4 h-4 mr-2' />
                End Interview
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default StartInterview