"use client";
import React, { useEffect } from 'react';
import Webcam from 'react-webcam';
import { Lightbulb, WebcamIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function Interview({ params }) {
  const [interviewdata, setInterviewdata] = React.useState();
  const [webcamenabled, setWebcamenabled] = React.useState(false);

  useEffect(() => {
    console.log(params);
    interviewDetails();
  }, [params]);

  const interviewDetails = async () => {
    try {
      const response = await fetch(`/api/interviews/${params.interviewid}`);
      
      if (!response.ok) {
        console.error("Failed to fetch interview details");
        return;
      }
      
      const result = await response.json();
      console.log(result);
      setInterviewdata(result);
    } catch (error) {
      console.error("Error fetching interview details:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#faf6f1] via-[#f5ebe0] to-white py-16 relative">
      {/* Decorative blur elements */}
      <div className='absolute top-20 right-10 w-96 h-96 bg-[#c5d5d0] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float' />
      <div className='absolute bottom-20 left-10 w-96 h-96 bg-[#f4cdb8] rounded-full mix-blend-multiply filter blur-3xl opacity-20' style={{animationDelay: '2s'}} />
      
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-display font-normal text-[#1a4d4d] mb-2">Let's Begin Your Journey</h1>
          <p className="text-[#6b7280] text-lg font-light">Review your session details and prepare your space</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {interviewdata && (
            <div className="space-y-6">
              <div className="bg-white/80 backdrop-blur-xl p-10 rounded-[40px] shadow-soft border-2 border-[#e5d5c8] hover:shadow-lg transition-all duration-300">
                <h3 className="text-xl font-medium text-[#1a4d4d] mb-6 flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#2d5f5f] to-[#4a6b5b] rounded-[40%_60%_50%_50%/60%_40%_60%_40%] flex items-center justify-center mr-3">
                    <span className="text-white text-lg">📋</span>
                  </div>
                  Session Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-[#6b7280] uppercase tracking-wide">Position</label>
                    <p className="text-lg font-medium text-[#1a4d4d] mt-1">{interviewdata.jobposition}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#6b7280] uppercase tracking-wide">Requirements</label>
                    <p className="text-[#4b5563] mt-1 leading-relaxed font-light">{interviewdata.jobdescription}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#6b7280] uppercase tracking-wide">Experience Level</label>
                    <p className="text-lg font-medium text-[#1a4d4d] mt-1">{interviewdata.jobexp} Years</p>
                  </div>
                </div>
              </div>
              
              <div className='bg-gradient-to-br from-[#f4cdb8]/90 to-[#f5ddd1]/90 backdrop-blur-xl p-8 rounded-[40px] border-2 border-[#e8b4a8] shadow-soft hover:shadow-lg transition-all duration-300'>
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-[#e8b4a8] rounded-[50%] flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#1a4d4d] text-lg mb-2">Gentle Reminders</h3>
                    <p className='text-[#4b5563] leading-relaxed font-light'>{process.env.NEXT_PUBLIC_INFORMATION}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white/80 backdrop-blur-xl p-10 rounded-[40px] shadow-soft border-2 border-[#e5d5c8] hover:shadow-lg transition-all duration-300">
            <h3 className="text-xl font-medium text-[#1a4d4d] mb-6 flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-[#4a6b5b] to-[#5a7d6b] rounded-[40%_60%_50%_50%/60%_40%_60%_40%] flex items-center justify-center mr-3">
                <WebcamIcon className="w-5 h-5 text-white" />
              </div>
              Camera Setup
            </h3>
            
            <div className="flex flex-col items-center justify-center">
              {webcamenabled ? (
                <div className="relative w-full aspect-video max-w-md">
                  <Webcam
                    onUserMedia={() => setWebcamenabled(true)}
                    onUserMediaError={() => setWebcamenabled(false)}
                    className="rounded-[40px] w-full h-full object-cover shadow-soft border-2 border-[#e5d5c8]"
                    mirrored={true}
                  />
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-[#4a6b5b] text-white px-4 py-2 rounded-[20px] text-sm font-medium shadow-soft">
                    ✓ Camera Active
                  </div>
                </div>
              ) : (
                <div className="w-full">
                  <div className="bg-white/60 backdrop-blur-lg rounded-[40px] border-2 border-dashed border-[#e5d5c8] p-16 flex flex-col items-center justify-center mb-6 hover:bg-white/80 transition-all duration-300">
                    <WebcamIcon className="w-24 h-24 text-[#a8b5a8] mb-4" />
                    <p className="text-[#4b5563] text-center mb-2 font-medium">Camera is resting</p>
                    <p className="text-[#6b7280] text-sm text-center font-light">Enable your camera to begin</p>
                  </div>
                  <Button
                    onClick={() => setWebcamenabled(true)}
                    className="w-full h-14 text-base bg-[#2d5f5f] hover:bg-[#1a4d4d] text-white font-medium rounded-[28px] shadow-soft hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    <WebcamIcon className="mr-2 w-5 h-5" />
                    Enable Webcam and Microphone
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className='flex justify-end mt-8'>
          <Link href={`/dashboard/interview/${params.interviewid}/start`}>
            <Button className="px-8 py-4 text-lg bg-[#2d5f5f] hover:bg-[#1a4d4d] text-white font-medium rounded-[28px] shadow-soft hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              Begin Session →
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}


export default Interview;
