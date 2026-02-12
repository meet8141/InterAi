"use client";
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import useSpeechToText from 'react-hook-speech-to-text';
import { Mic, MicOff, Video, Shield, TrendingUp, AlertTriangle, Info, Camera, Eye, Sun, MonitorSpeaker, MessageSquare, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import { useUser } from '@clerk/clerk-react';
import { chatSession } from '@/utils/Geminimodel';
import moment from 'moment';
import { analyzeConfidence, getConfidenceColor, getConfidenceBgColor } from '@/utils/confidenceAnalyzer';
import { captureFrame, analyzeVideoFrame, getVideoScoreColor, getVideoScoreBgColor, getCheckStatusIcon } from '@/utils/videoAnalyzer';

const Webcam = dynamic(() => import('react-webcam'), { ssr: false });

function RecordAnswerSection({ mockinterviewquestions, activequestionindex, interviewdata }) {
  const [userAnswer, setUserAnswer] = useState('');
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [webcamError, setWebcamError] = useState('');
  const [recordingStartTime, setRecordingStartTime] = useState(null);
  const webcamRef = React.useRef(null);
  const videoFeedbackRef = React.useRef(null);
  
  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
    interimResults: true,
  });

  useEffect(() => {
    if (results && results.length > 0) {
      results.forEach((result) => {
        if (result?.transcript) {
          setUserAnswer((prevAns) => prevAns + ' ' + result.transcript);
        }
      });
    }
  }, [results]);

  useEffect(() => {
    if (!isRecording && userAnswer.length > 10) {
      updateUserAnswerInDb();
    }
  }, [userAnswer, isRecording]);

  useEffect(() => {
    if (isRecording) {
      toast.info('Answer should be more than 10 characters');
    }
  }, [isRecording]);

  const saveUserAnswer = async () => {
    setLoading(true);
    if (isRecording) {
      // Capture & analyze video frame right before stopping
      try {
        const frame = captureFrame(webcamRef);
        if (frame) {
          const vf = await analyzeVideoFrame(frame);
          videoFeedbackRef.current = vf;
        }
      } catch (err) {
        console.error('Video analysis error:', err);
      }
      stopSpeechToText();
    } else {
      setRecordingStartTime(Date.now());
      videoFeedbackRef.current = null;
      startSpeechToText();
    }
    setLoading(false);
  };

  const updateUserAnswerInDb = async () => {
    if (!interviewdata || !interviewdata.mockid) {
      toast.error("Interview data is not available. Please try again.");
      return;
    }
  
    // ── Confidence Analysis ──
    const durationSec = recordingStartTime ? (Date.now() - recordingStartTime) / 1000 : null;
    const confidence = analyzeConfidence(userAnswer, durationSec);
    const videoData = videoFeedbackRef.current;

    const feedbackPrompt = `You are a senior technical interviewer evaluating a candidate's spoken answer. Be liberal and forgiving in your evaluation.

Question: ${mockinterviewquestions[activequestionindex]?.question}
Candidate's Answer: ${userAnswer}

Speech confidence analysis: Score ${confidence.score}/100 (${confidence.level}), ${confidence.metrics.fillerCount} filler words, ${confidence.metrics.hedgeCount} hedging phrases, ${confidence.metrics.assertiveCount} assertive phrases, vocab richness ${confidence.metrics.vocabRichness}%, ${confidence.metrics.wordCount} total words, ${confidence.metrics.sentenceCount} sentences${confidence.metrics.pace ? `, pace: ${confidence.metrics.pace} words/sec` : ''}.

EVALUATION GUIDELINES — be generous and understanding:
- Technical questions are often abstract and open-ended. Accept ANY valid interpretation or approach.
- The candidate is speaking, not writing — expect informal phrasing, incomplete sentences, and less structure. Do NOT penalize spoken language style.
- If the candidate demonstrates understanding of the core concept, even partially or through examples/analogies, give credit.
- Accept high-level/abstract explanations just as much as detailed/specific ones — both are valid.
- Do NOT require exact terminology or textbook definitions. Practical understanding matters more.
- If the answer is in the right direction but incomplete, rate it favorably (5+) and suggest what could be added.
- Only give low ratings (1-3) if the answer is fundamentally wrong, completely off-topic, or essentially empty.
- A rating of 7+ should be given if the candidate clearly understands the concept, even if they miss minor details.

Return your evaluation as JSON only with these fields:
- rating (1-10): Be generous — reward understanding over perfection
- feedback: Constructive and encouraging. Comment on content quality AND delivery confidence. Mention what was good before suggesting improvements.
- speechTips: An array of 2-3 specific tips on how the candidate should improve their speaking style (pace, tone, structure, word choice). Be detailed and actionable.
- confidenceScore (${confidence.score})

JSON format only, no extra text.`;
  
    const result = await chatSession.sendMessage(feedbackPrompt);
    let responseText = await result.response.text();
  
    responseText = responseText.trim()
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .replace(/[\u0000-\u001F]+/g, '');
  
    let jsonResponse;
    try {
      jsonResponse = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      toast.error("There was an error parsing the feedback. Please try again.", { duration: 5000 });
      setLoading(false);
      return;
    }
  
    const response = await fetch(`/api/feedback/${interviewdata.mockid}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mockidRef: interviewdata.mockid,
        question: mockinterviewquestions[activequestionindex]?.question,
        correctanswer: mockinterviewquestions[activequestionindex]?.answer,
        useranswer: userAnswer,
        feedback: jsonResponse?.feedback,
        detailedFeedback: JSON.stringify({
          confidence: { score: confidence.score, level: confidence.level, metrics: confidence.metrics, tips: confidence.tips, speechCoaching: confidence.speechCoaching },
          video: videoData ? { score: videoData.score, level: videoData.level, checks: videoData.checks, tips: videoData.tips } : null,
          speechTips: jsonResponse?.speechTips || [],
        }),
        rating: jsonResponse?.rating,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        createdat: moment().format('YYYY-MM-DD HH:mm:ss')
      })
    });
  
    if (response.ok) {
      toast.success('Answer recorded successfully');
      setUserAnswer('');
      setResults([]);
    }
    setLoading(false);
    setResults([]);
    setTimeout(() => {
      setLoading(false);
      toast.success('Click on Next Question to continue');
    }, 1000);
  };

  const handleWebcamError = (error) => {
    console.error('Webcam error:', error);
    setWebcamError('Could not access webcam. Please check permissions and try again.');
    toast.error('Could not access webcam. Please check permissions.');
  };

  return (
    <div className="space-y-6">
      {/* Webcam card */}
      <div className="bg-white/80 backdrop-blur-xl rounded-[32px] p-6 shadow-soft border-2 border-[#e5d5c8]">
        <h3 className="text-lg font-medium text-[#1a4d4d] mb-4 flex items-center gap-2">
          <Video className="w-5 h-5 text-[#4a6b5b]" />
          Your Response
        </h3>

        <div className="relative w-full max-w-md mx-auto aspect-video overflow-hidden rounded-[24px] border-2 border-[#e5d5c8] bg-[#f5ebe0]">
          {webcamError ? (
            <div className="flex items-center justify-center h-full p-4">
              <p className="text-sm text-red-600 text-center">{webcamError}</p>
            </div>
          ) : (
            <>
              <Image src="/webcam.png" width={200} height={200} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30" alt="Webcam Placeholder" />
              <Webcam
                ref={webcamRef}
                mirrored={true}
                screenshotFormat="image/jpeg"
                onUserMediaError={handleWebcamError}
                className="relative z-10 w-full h-full object-cover"
              />
            </>
          )}
        </div>

        {/* Recording status */}
        {isRecording && (
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-[#b91c1c]">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            Recording in progress…
          </div>
        )}
      </div>

      {/* Record button */}
      <div className="flex justify-center">
        <Button
          variant="outline"
          disabled={loading}
          onClick={saveUserAnswer}
          className={`
            h-14 px-8 rounded-[28px] font-medium transition-all duration-300 text-base
            ${isRecording
              ? 'border-red-300 bg-red-50 hover:bg-red-100 text-[#b91c1c]'
              : 'border-[#e5d5c8] hover:border-[#4a6b5b] hover:bg-[#f5ebe0] text-[#2d5f5f]'
            }
          `}
        >
          {isRecording ? (
            <span className="flex items-center gap-2">
              <MicOff className="w-5 h-5" /> Stop Recording
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Mic className="w-5 h-5" /> Record Answer
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}

export default RecordAnswerSection;
