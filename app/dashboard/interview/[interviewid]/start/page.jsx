"use client";
import React, { useEffect } from 'react';
import RecordAnswerSection from './_components/RecordAnswerSection';
import { useParams } from 'next/navigation';

function StartInterview() {
    const params = useParams();
    const [interviewdata, setInterviewdata] = React.useState();
    const [mockinterviewquestions, setMockinterviewquestions] = React.useState([]);
    const [activequestionindex, setActivequestionindex] = React.useState(0);

    useEffect(() => {
        if (params?.interviewid) dbdata();
    }, [params]);

    const dbdata = async () => {
        try {
          const response = await fetch(`/api/interviews/${params.interviewid}`);
          if (!response.ok) {
            console.error("Failed to fetch interview data");
            return;
          }
          const result = await response.json();
          let questions = JSON.parse(result.jsonmockresp);
          if (questions && !Array.isArray(questions)) {
            questions = Object.values(questions).find(v => Array.isArray(v)) || [];
          }
          setMockinterviewquestions(questions || []);
          setInterviewdata(result);
        } catch (error) {
          console.error("Error fetching interview details:", error);
        }
    };

  return (
    <div className='h-screen bg-[#faf6f1] flex items-center justify-center p-6'>
      <RecordAnswerSection
        mockinterviewquestions={mockinterviewquestions}
        activequestionindex={activequestionindex}
        interviewdata={interviewdata}
        onPrev={() => setActivequestionindex(Math.max(0, activequestionindex - 1))}
        onNext={() => setActivequestionindex(Math.min(mockinterviewquestions.length - 1, activequestionindex + 1))}
        isFirst={activequestionindex === 0}
        isLast={activequestionindex === mockinterviewquestions.length - 1}
        interviewId={params?.interviewid}
      />
    </div>
  )
}

export default StartInterview