"use client";
import React, { useEffect, useState, useMemo } from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, Trophy, Star, MessageSquare, CheckCircle2, XCircle, ArrowLeft, Shield, Camera, Mic2, TrendingUp, AlertTriangle, BarChart3, Video, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter, useParams } from 'next/navigation';

function Feedback() {
  const params = useParams();
  const [feedbackData, setFeedbackData] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (params?.interviewid) GetInterviewData();
  }, [params]);

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

  // Parse detailedFeedback JSON from each item
  const parseDetailed = (item) => {
    if (!item.detailedFeedback) return null;
    try { return JSON.parse(item.detailedFeedback); } catch { return null; }
  };

  const statusPriority = (status) => {
    if (status === 'poor') return 3;
    if (status === 'warning') return 2;
    if (status === 'info') return 1;
    return 0;
  };

  // Aggregate session-level stats
  const sessionStats = useMemo(() => {
    if (feedbackData.length === 0) return null;

    let totalConfidence = 0, confCount = 0;
    let totalVideo = 0, videoCount = 0;
    let totalWords = 0, totalFillers = 0, totalHedges = 0, totalAssertive = 0, totalRepetitions = 0;
    const allSpeechCoaching = {};
    const allVideoChecks = {};
    const allSpeechTips = [];
    const allConfidenceTips = [];

    feedbackData.forEach((item) => {
      const d = parseDetailed(item);
      if (!d) return;

      if (d.confidence) {
        totalConfidence += d.confidence.score;
        confCount++;
        if (d.confidence.metrics) {
          totalWords += d.confidence.metrics.wordCount || 0;
          totalFillers += d.confidence.metrics.fillerCount || 0;
          totalHedges += d.confidence.metrics.hedgeCount || 0;
          totalAssertive += d.confidence.metrics.assertiveCount || 0;
          totalRepetitions += d.confidence.metrics.repetitionCount || 0;
        }
        // Collect unique confidence tips
        if (d.confidence.tips) {
          d.confidence.tips.forEach((t) => {
            if (!allConfidenceTips.includes(t)) allConfidenceTips.push(t);
          });
        }
        // Merge speech coaching (keep worst status per category)
        if (d.confidence.speechCoaching) {
          Object.entries(d.confidence.speechCoaching).forEach(([key, val]) => {
            if (!allSpeechCoaching[key] || statusPriority(val.status) > statusPriority(allSpeechCoaching[key].status)) {
              allSpeechCoaching[key] = val;
            }
          });
        }
      }

      if (d.video) {
        totalVideo += d.video.score;
        videoCount++;
        if (d.video.checks) {
          Object.entries(d.video.checks).forEach(([key, val]) => {
            if (!allVideoChecks[key] || statusPriority(val.status) > statusPriority(allVideoChecks[key].status)) {
              allVideoChecks[key] = val;
            }
          });
        }
      }

      if (d.speechTips) {
        d.speechTips.forEach((t) => {
          if (!allSpeechTips.includes(t)) allSpeechTips.push(t);
        });
      }
    });

    return {
      avgConfidence: confCount > 0 ? Math.round(totalConfidence / confCount) : null,
      avgVideo: videoCount > 0 ? Math.round(totalVideo / videoCount) : null,
      totalWords,
      totalFillers,
      totalHedges,
      totalAssertive,
      totalRepetitions,
      questionCount: feedbackData.length,
      speechCoaching: allSpeechCoaching,
      videoChecks: allVideoChecks,
      speechTips: allSpeechTips.slice(0, 6),
      confidenceTips: allConfidenceTips.slice(0, 8),
    };
  }, [feedbackData]);

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-[#16a34a]';
    if (score >= 60) return 'text-[#2d5f5f]';
    if (score >= 40) return 'text-[#d97706]';
    return 'text-[#b91c1c]';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-[#dcfce7] border-[#bbf7d0] text-[#16a34a]';
    if (score >= 60) return 'bg-[#e0f2f1] border-[#b2dfdb] text-[#2d5f5f]';
    if (score >= 40) return 'bg-[#fef3c7] border-[#fde68a] text-[#d97706]';
    return 'bg-[#fef2f2] border-[#fecaca] text-[#b91c1c]';
  };

  const getBarColor = (score) => {
    if (score >= 80) return '#16a34a';
    if (score >= 60) return '#2d5f5f';
    if (score >= 40) return '#d97706';
    return '#b91c1c';
  };

  const getStatusIcon = (status) => {
    if (status === 'good') return '✅';
    if (status === 'info') return 'ℹ️';
    if (status === 'warning') return '⚠️';
    if (status === 'poor') return '❌';
    return '•';
  };

  const getConfidenceLabel = (score) => {
    if (score >= 80) return 'Very High';
    if (score >= 60) return 'High';
    if (score >= 40) return 'Moderate';
    if (score >= 20) return 'Low';
    return 'Very Low';
  };

  const getVideoLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
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
              <p className='text-[#4b5563] text-lg font-light'>Here's your complete interview feedback</p>

              {/* Overall rating */}
              <div className='inline-flex items-center gap-3 bg-[#f5ebe0] px-6 py-3 rounded-full border-2 border-[#e5d5c8]'>
                <Star className='w-6 h-6 text-[#e8b4a8] fill-current' />
                <span className='text-2xl font-display font-normal text-[#1a4d4d]'>{averageRating}<span className='text-base text-[#6b7280]'>/10</span></span>
                <span className='text-sm text-[#6b7280] font-light'>Overall Rating</span>
              </div>
            </>
          )}
        </div>

        {/* ═══════════════════════════════════════════════════════ */}
        {/* SESSION-LEVEL SUMMARY CARDS                             */}
        {/* ═══════════════════════════════════════════════════════ */}
        {sessionStats && (
          <>
            {/* Score overview cards */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              {/* Confidence Score Card */}
              {sessionStats.avgConfidence !== null && (
                <div className='bg-white/80 backdrop-blur-xl rounded-[24px] p-6 shadow-soft border-2 border-[#e5d5c8] space-y-3'>
                  <div className='flex items-center gap-2'>
                    <Shield className='w-5 h-5 text-[#4a6b5b]' />
                    <h3 className='text-base font-medium text-[#1a4d4d]'>Avg. Confidence Score</h3>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className={`text-3xl font-display font-semibold ${getScoreColor(sessionStats.avgConfidence)}`}>
                      {sessionStats.avgConfidence}/100
                    </span>
                    <span className={`text-sm font-medium px-3 py-1 rounded-full border ${getScoreBg(sessionStats.avgConfidence)}`}>
                      {getConfidenceLabel(sessionStats.avgConfidence)}
                    </span>
                  </div>
                  <div className='w-full h-3 bg-[#f5ebe0] rounded-full overflow-hidden'>
                    <div className='h-full rounded-full transition-all duration-700' style={{ width: `${sessionStats.avgConfidence}%`, backgroundColor: getBarColor(sessionStats.avgConfidence) }} />
                  </div>
                  <div className='flex justify-between text-xs text-[#6b7280]'>
                    <span>{sessionStats.totalWords} total words</span>
                    <span>{sessionStats.totalFillers} filler words</span>
                  </div>
                </div>
              )}

              {/* Video Score Card */}
              {sessionStats.avgVideo !== null && (
                <div className='bg-white/80 backdrop-blur-xl rounded-[24px] p-6 shadow-soft border-2 border-[#e5d5c8] space-y-3'>
                  <div className='flex items-center gap-2'>
                    <Camera className='w-5 h-5 text-[#4a6b5b]' />
                    <h3 className='text-base font-medium text-[#1a4d4d]'>Avg. Presentation Score</h3>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className={`text-3xl font-display font-semibold ${getScoreColor(sessionStats.avgVideo)}`}>
                      {sessionStats.avgVideo}/100
                    </span>
                    <span className={`text-sm font-medium px-3 py-1 rounded-full border ${getScoreBg(sessionStats.avgVideo)}`}>
                      {getVideoLabel(sessionStats.avgVideo)}
                    </span>
                  </div>
                  <div className='w-full h-3 bg-[#f5ebe0] rounded-full overflow-hidden'>
                    <div className='h-full rounded-full transition-all duration-700' style={{ width: `${sessionStats.avgVideo}%`, backgroundColor: getBarColor(sessionStats.avgVideo) }} />
                  </div>
                </div>
              )}
            </div>

            {/* Confidence Detailed Feedback */}
            {sessionStats.avgConfidence !== null && (
              <div className='bg-white/80 backdrop-blur-xl rounded-[32px] p-6 shadow-soft border-2 border-[#e5d5c8] space-y-4'>
                <h3 className='text-lg font-medium text-[#1a4d4d] flex items-center gap-2'>
                  <Shield className='w-5 h-5 text-[#4a6b5b]' />
                  Confidence & Delivery Feedback
                </h3>

                {/* Session metrics grid */}
                <div className='grid grid-cols-2 sm:grid-cols-5 gap-3'>
                  <div className='bg-[#f5ebe0] rounded-[16px] p-3 text-center'>
                    <p className='text-xs text-[#6b7280] font-medium'>Total Words</p>
                    <p className='text-lg font-semibold text-[#1a4d4d]'>{sessionStats.totalWords}</p>
                  </div>
                  <div className='bg-[#f5ebe0] rounded-[16px] p-3 text-center'>
                    <p className='text-xs text-[#6b7280] font-medium'>Filler Words</p>
                    <p className={`text-lg font-semibold ${sessionStats.totalFillers > sessionStats.questionCount * 3 ? 'text-[#b91c1c]' : 'text-[#1a4d4d]'}`}>{sessionStats.totalFillers}</p>
                  </div>
                  <div className='bg-[#f5ebe0] rounded-[16px] p-3 text-center'>
                    <p className='text-xs text-[#6b7280] font-medium'>Hedging</p>
                    <p className={`text-lg font-semibold ${sessionStats.totalHedges > sessionStats.questionCount * 2 ? 'text-[#d97706]' : 'text-[#1a4d4d]'}`}>{sessionStats.totalHedges}</p>
                  </div>
                  <div className='bg-[#f5ebe0] rounded-[16px] p-3 text-center'>
                    <p className='text-xs text-[#6b7280] font-medium'>Assertive</p>
                    <p className={`text-lg font-semibold ${sessionStats.totalAssertive >= sessionStats.questionCount ? 'text-[#16a34a]' : 'text-[#d97706]'}`}>{sessionStats.totalAssertive}</p>
                  </div>
                  <div className='bg-[#f5ebe0] rounded-[16px] p-3 text-center'>
                    <p className='text-xs text-[#6b7280] font-medium'>Repetitions</p>
                    <p className={`text-lg font-semibold ${sessionStats.totalRepetitions > sessionStats.questionCount ? 'text-[#b91c1c]' : 'text-[#1a4d4d]'}`}>{sessionStats.totalRepetitions}</p>
                  </div>
                </div>

                {/* Confidence tips */}
                {sessionStats.confidenceTips.length > 0 && (
                  <div className='space-y-2 pt-2'>
                    <p className='text-sm font-medium text-[#1a4d4d]'>How to improve your delivery:</p>
                    {sessionStats.confidenceTips.map((tip, i) => (
                      <div key={i} className='flex items-start gap-2'>
                        {sessionStats.avgConfidence >= 70 ? (
                          <TrendingUp className='w-4 h-4 text-[#16a34a] mt-0.5 flex-shrink-0' />
                        ) : (
                          <AlertTriangle className='w-4 h-4 text-[#d97706] mt-0.5 flex-shrink-0' />
                        )}
                        <p className='text-sm text-[#4b5563] leading-relaxed'>{tip}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Camera & Presentation Feedback */}
            {Object.keys(sessionStats.videoChecks).length > 0 && (
              <div className='bg-white/80 backdrop-blur-xl rounded-[32px] p-6 shadow-soft border-2 border-[#e5d5c8] space-y-4'>
                <h3 className='text-lg font-medium text-[#1a4d4d] flex items-center gap-2'>
                  <Video className='w-5 h-5 text-[#4a6b5b]' />
                  Camera & Presentation Feedback
                </h3>
                <div className='space-y-3'>
                  {Object.entries(sessionStats.videoChecks).map(([key, check]) => (
                    <div key={key} className='bg-[#f5ebe0] rounded-[16px] p-3'>
                      <div className='flex items-center gap-2 mb-1'>
                        <span className='text-base'>{getStatusIcon(check.status)}</span>
                        <span className='text-sm font-semibold text-[#1a4d4d] capitalize'>
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </div>
                      <p className='text-sm text-[#4b5563] leading-relaxed ml-7'>{check.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Speech Coaching */}
            {Object.keys(sessionStats.speechCoaching).length > 0 && (
              <div className='bg-white/80 backdrop-blur-xl rounded-[32px] p-6 shadow-soft border-2 border-[#e5d5c8] space-y-4'>
                <h3 className='text-lg font-medium text-[#1a4d4d] flex items-center gap-2'>
                  <Mic2 className='w-5 h-5 text-[#4a6b5b]' />
                  Detailed Speech Coaching
                </h3>
                <div className='space-y-3'>
                  {Object.entries(sessionStats.speechCoaching).map(([key, item]) => (
                    <div key={key} className='bg-[#f5ebe0] rounded-[16px] p-3'>
                      <div className='flex items-center gap-2 mb-1'>
                        <span className='text-base'>{getStatusIcon(item.status)}</span>
                        <span className='text-sm font-semibold text-[#1a4d4d] capitalize'>
                          {key.replace(/([A-Z])/g, ' $1').replace(/And/g, '&').trim()}
                        </span>
                      </div>
                      <p className='text-sm text-[#4b5563] leading-relaxed ml-7'>{item.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Speech Tips */}
            {sessionStats.speechTips.length > 0 && (
              <div className='bg-white/80 backdrop-blur-xl rounded-[32px] p-6 shadow-soft border-2 border-[#e5d5c8] space-y-4'>
                <h3 className='text-lg font-medium text-[#1a4d4d] flex items-center gap-2'>
                  <BookOpen className='w-5 h-5 text-[#4a6b5b]' />
                  AI Speech Improvement Tips
                </h3>
                <div className='space-y-2'>
                  {sessionStats.speechTips.map((tip, i) => (
                    <div key={i} className='flex items-start gap-2'>
                      <TrendingUp className='w-4 h-4 text-[#2d5f5f] mt-0.5 flex-shrink-0' />
                      <p className='text-sm text-[#4b5563] leading-relaxed'>{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* ═══════════════════════════════════════════════════════ */}
        {/* PER-QUESTION BREAKDOWN                                  */}
        {/* ═══════════════════════════════════════════════════════ */}
        {feedbackData.length > 0 && (
          <div className='space-y-4'>
            <h2 className='text-xl font-medium text-[#1a4d4d]'>Question-by-Question Breakdown</h2>

            {feedbackData.map((data, index) => {
              const detailed = parseDetailed(data);
              const conf = detailed?.confidence;
              return (
                <Collapsible key={index}>
                  <CollapsibleTrigger className='w-full bg-white/80 backdrop-blur-xl rounded-[20px] p-5 shadow-soft border-2 border-[#e5d5c8] hover:border-[#4a6b5b] hover:shadow-md transition-all duration-300 text-left flex items-center justify-between gap-4 group'>
                    <div className='flex items-center gap-3 flex-1 min-w-0'>
                      <span className='flex-shrink-0 w-8 h-8 rounded-full bg-[#2d5f5f] text-white text-sm font-semibold flex items-center justify-center'>
                        {index + 1}
                      </span>
                      <span className='text-[#1a4d4d] font-medium truncate'>{data.question}</span>
                    </div>
                    <div className='flex items-center gap-3 flex-shrink-0'>
                      {conf && (
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full border flex items-center gap-1 ${getScoreBg(conf.score)}`}>
                          <Shield className='w-3 h-3' />
                          {conf.score}%
                        </span>
                      )}
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
              );
            })}
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
