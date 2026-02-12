"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Lightbulb, Volume2, Shirt, CheckCircle2, BookOpen, Eye, EyeOff } from 'lucide-react';

/* ─────────────── Dressing & Posture Questions with Ideal Answers ─────────────── */
const DRESSING_POSTURE_QUESTIONS = [
  {
    question: "What would you wear to a formal corporate interview (e.g., at a bank or consulting firm)?",
    category: "Dress Code",
    answer: "For a formal corporate interview, wear a well-fitted dark-coloured suit (navy, charcoal, or black) with a crisp white or light-blue dress shirt. Pair it with a conservative tie (for men) or a simple blouse (for women). Choose polished leather shoes — black or dark brown. Keep accessories minimal: a classic watch, no flashy jewellery. Ensure your clothes are ironed, nails are trimmed and clean, and hair is neatly styled. A subtle, fresh fragrance is fine but avoid strong perfumes. Carry a professional bag or portfolio, not a backpack.",
    keyPoints: ["Dark well-fitted suit", "Crisp dress shirt", "Polished leather shoes", "Minimal accessories", "Clean grooming — nails, hair, subtle fragrance"],
  },
  {
    question: "How would you dress for a startup or creative company interview where the culture is casual?",
    category: "Dress Code",
    answer: "For a casual or startup environment, go with smart-casual attire. Clean, dark jeans or well-fitted chinos work well, paired with a collared shirt, a neat polo, or a smart top. You can add a blazer for a polished touch without being overdressed. Wear clean sneakers or loafers — avoid flip-flops or very worn shoes. Skip the tie. Keep your look neat, fitted, and well-groomed. The goal is to look put-together while fitting the relaxed company culture. Research the company's social media or team photos beforehand for cues.",
    keyPoints: ["Dark jeans or chinos", "Collared shirt or smart top", "Optional blazer", "Clean sneakers or loafers", "Research company culture beforehand"],
  },
  {
    question: "What are 3 common dressing mistakes candidates make in interviews?",
    category: "Dress Code",
    answer: "Three common mistakes are: (1) Wearing wrinkled or ill-fitting clothes — this signals carelessness; always iron your outfit and ensure it fits well. (2) Overdressing or underdressing for the company culture — wearing a full suit to a creative startup or jeans to a bank both create wrong impressions; always research the dress code. (3) Distracting accessories or strong fragrances — flashy jewellery, loud patterns, or heavy perfume/cologne pull attention away from your words. Keep it simple, clean, and professional.",
    keyPoints: ["Wrinkled or ill-fitting clothes", "Not matching company culture", "Distracting accessories or strong fragrances"],
  },
  {
    question: "How does your outfit impact the interviewer's first impression? Why does dressing well matter?",
    category: "First Impression",
    answer: "Research shows first impressions form within 7 seconds of meeting someone. Your outfit is one of the first things an interviewer notices — before you even speak. Dressing well signals professionalism, attention to detail, respect for the opportunity, and that you take the role seriously. It also boosts your own confidence. A well-groomed appearance creates a positive halo effect, making the interviewer more receptive to your answers. Conversely, a sloppy appearance can create unconscious bias against you, regardless of your qualifications.",
    keyPoints: ["First impressions form in 7 seconds", "Signals professionalism & attention to detail", "Boosts your own confidence", "Creates a positive halo effect"],
  },
  {
    question: "How should you sit in an interview chair to look confident and engaged?",
    category: "Posture",
    answer: "Sit with your back straight but not stiff — about 10 degrees leaning forward shows engagement and interest. Keep both feet flat on the floor, shoulder-width apart. Place your hands on the table or gently in your lap — visible hands build trust. Avoid crossing your arms (it looks defensive), slouching (it signals low energy), or leaning too far back (it appears disinterested). Keep your shoulders relaxed and down, not hunched up near your ears. Nod occasionally while the interviewer speaks to show active listening.",
    keyPoints: ["Back straight, lean slightly forward", "Feet flat on the floor", "Hands visible on table or lap", "Don't cross arms or slouch", "Nod to show active listening"],
  },
  {
    question: "What role does eye contact play in looking confident? How much is ideal?",
    category: "Body Language",
    answer: "Eye contact is one of the strongest signals of confidence and honesty. Maintain natural eye contact about 60–70% of the time. Look at the interviewer's 'forehead triangle' — the area between their eyes and forehead — this feels comfortable for both parties. Break eye contact naturally when thinking (look slightly up or to the side, not down). If there's a panel, make eye contact with the person who asked the question, then briefly glance at others. Too much eye contact (constant staring) feels aggressive; too little (looking down/away) signals nervousness or dishonesty.",
    keyPoints: ["Maintain eye contact 60-70% of the time", "Use the forehead triangle technique", "Break gaze naturally when thinking", "With panels, focus on the questioner", "Avoid both staring and looking away"],
  },
  {
    question: "How can you use hand gestures effectively without looking nervous?",
    category: "Body Language",
    answer: "Effective hand gestures add energy and emphasis to your answers. Use open palms (facing up or to the side) — this signals honesty and openness. Keep gestures within your shoulder frame; going wider looks erratic. Use counting gestures ('First… Second… Third…') to structure answers. When not gesturing, rest hands gently on the table or steepled (fingertips touching). Avoid: fidgeting with a pen, touching your face or hair, tapping the table, cracking knuckles, or hiding your hands under the table. Practice in front of a mirror to find your natural gesture range.",
    keyPoints: ["Open palms signal honesty", "Keep gestures within shoulder frame", "Use counting gestures to structure points", "Rest hands gently when not gesturing", "Avoid fidgeting, face-touching, pen-clicking"],
  },
  {
    question: "What makes a confident handshake and what mistakes should you avoid?",
    category: "First Impression",
    answer: "A confident handshake has a firm (but not crushing) grip, lasts about 2–3 seconds with 2–3 pumps. Stand up if seated, make direct eye contact, and offer a genuine smile while shaking hands. Your palm should meet theirs fully — not just fingertips. Common mistakes to avoid: a limp 'dead fish' handshake (signals weakness), a bone-crusher grip (signals aggression), sweaty palms (discreetly dry them before greeting), shaking too long, or avoiding the handshake altogether. If you tend to have sweaty palms, keep a tissue in your pocket and wipe just before the greeting.",
    keyPoints: ["Firm grip, 2-3 pumps, 2-3 seconds", "Eye contact + genuine smile", "Full palm contact", "Avoid limp or crushing grip", "Dry palms beforehand if needed"],
  },
  {
    question: "How do you manage nervous body language during an interview?",
    category: "Posture",
    answer: "Nervousness is normal, but you can manage visible signs: (1) Before the interview, practice deep breathing — inhale for 4 seconds, hold for 4, exhale for 4. This calms your nervous system. (2) Plant both feet firmly on the ground — this physically anchors you and stops leg-shaking. (3) Place your hands on the table or clasp them gently — this prevents fidgeting. (4) Prepare and rehearse answers so you feel confident in the content. (5) Pause before answering — a 2-second pause looks thoughtful, not nervous. (6) Remind yourself: the interviewer wants you to succeed. Power-posing for 2 minutes before the interview (hands on hips, standing tall) has been shown to reduce cortisol and increase confidence.",
    keyPoints: ["Deep breathing: 4-4-4 technique", "Plant feet on the ground", "Hands on table to prevent fidgeting", "Pause 2 seconds before answering", "Power-pose before entering the room", "Preparation reduces anxiety"],
  },
  {
    question: "Describe a complete pre-interview routine — from the night before to walking into the room.",
    category: "Overall Confidence",
    answer: "Night before: Choose and iron your outfit, polish shoes, trim nails, and pack your bag (resume copies, portfolio, pen, notebook). Get 7–8 hours of sleep. Morning: Shower, groom well, eat a light healthy meal, and dress in your prepared outfit. Check yourself in a full-length mirror. Travel: Leave early — aim to arrive 15 minutes before your slot. Waiting area: Sit upright, review your notes, smile at staff (they may give feedback). Put your phone on silent. Power-pose in the restroom for 2 minutes. Take 3 deep breaths. Entering the room: Walk in with your shoulders back, chin up, and a warm smile. Make eye contact. Offer a firm handshake: 'Hello, I'm [Name]. Thank you for this opportunity.' Wait to be invited to sit. Place your bag beside, not on, the chair. Sit upright, lean slightly forward, hands on the table. You're ready.",
    keyPoints: ["Prepare outfit the night before", "Arrive 15 minutes early", "Power-pose in restroom", "Walk in tall with warm smile", "Firm handshake + greeting", "Sit upright, lean forward, hands visible"],
  },
];

/* ────────────────────────────────────────────────────────────────────────── */

function DressingPosturePractice() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [revealedAnswers, setRevealedAnswers] = useState({});

  const toggleReveal = (index) => {
    setRevealedAnswers((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    }
  };

  const currentQ = DRESSING_POSTURE_QUESTIONS[activeIndex];
  const isRevealed = revealedAnswers[activeIndex] || false;
  const revealedCount = Object.values(revealedAnswers).filter(Boolean).length;

  return (
    <div className='min-h-screen bg-gradient-to-b from-[#faf6f1] via-[#f5ebe0] to-white relative'>
      <div className='absolute top-20 right-10 w-72 h-72 bg-[#c5d5d0] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float pointer-events-none' />
      <div className='absolute bottom-20 left-10 w-96 h-96 bg-[#f4cdb8] rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none' style={{ animationDelay: '2s' }} />

      <div className='relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10'>
        {/* Page header */}
        <div>
          <div className='flex items-center gap-2 mb-2'>
            <Link href='/dashboard' className='text-[#5b4a6b] hover:text-[#3d2d4a] transition-colors'>
              <ArrowLeft className='w-5 h-5' />
            </Link>
            <h1 className='text-3xl md:text-4xl font-display font-normal text-[#1a4d4d]'>Dressing & Posture Guide</h1>
          </div>
          <p className='text-[#6b7280] text-lg font-light'>
            Question {activeIndex + 1} of {DRESSING_POSTURE_QUESTIONS.length} — read, learn, and practice confidently.
          </p>
        </div>

        {/* Progress chips */}
        <div className='bg-white/80 backdrop-blur-xl p-6 rounded-[32px] border-2 border-[#e5d5c8] shadow-soft'>
          <div className='flex items-center justify-between mb-3'>
            <h3 className='text-sm font-medium text-[#6b7280] uppercase tracking-wide'>Progress</h3>
            <span className='text-xs text-[#5b4a6b] font-medium bg-[#f0ebf5] px-3 py-1 rounded-full'>
              {revealedCount}/{DRESSING_POSTURE_QUESTIONS.length} reviewed
            </span>
          </div>
          <div className='flex flex-wrap gap-2'>
            {DRESSING_POSTURE_QUESTIONS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`
                  px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer
                  ${activeIndex === i
                    ? 'bg-[#5b4a6b] text-white shadow-soft scale-105'
                    : revealedAnswers[i]
                      ? 'bg-[#d4edda] text-[#1f5132] border border-[#c3e6cb]'
                      : 'bg-[#f5ebe0] text-[#1f2937] hover:bg-[#f4cdb8]'
                  }
                `}
              >
                Q{i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Question Card */}
        <div className='bg-white/80 backdrop-blur-xl p-8 rounded-[32px] border-2 border-[#e5d5c8] shadow-soft space-y-6'>
          {/* Category badge */}
          <span className='text-xs font-medium text-[#5b4a6b] bg-[#f0ebf5] px-3 py-1 rounded-full'>
            {currentQ.category}
          </span>

          {/* Question */}
          <div className='bg-gradient-to-br from-[#f0ebf5] to-[#faf6f1] p-6 rounded-[24px] border-2 border-[#ddd5e8]'>
            <div className='flex items-start justify-between'>
              <div className='flex-1'>
                <h4 className='text-sm font-medium text-[#5b4a6b] mb-2'>Question {activeIndex + 1}</h4>
                <p className='text-lg md:text-xl font-medium text-[#1a4d4d] leading-relaxed'>
                  {currentQ.question}
                </p>
              </div>
              <button
                onClick={() => speakText(currentQ.question)}
                className='ml-4 w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-[#f0ebf5] transition-all duration-300 shadow-soft hover:shadow-md group flex-shrink-0'
                title='Listen to question'
              >
                <Volume2 className='w-5 h-5 text-[#5b4a6b] group-hover:scale-110 transition-transform' />
              </button>
            </div>
          </div>

          {/* Tip */}
          <div className='bg-gradient-to-br from-[#f4cdb8]/40 to-[#f5ddd1]/40 p-5 rounded-[20px] border-2 border-[#e8b4a8]/60'>
            <div className='flex items-start space-x-3'>
              <div className='w-8 h-8 bg-[#e8b4a8] rounded-[10px] flex items-center justify-center flex-shrink-0'>
                <Lightbulb className='w-4 h-4 text-white' />
              </div>
              <div>
                <h4 className='font-medium text-[#1a4d4d] mb-1'>Quick Tip</h4>
                <p className='text-sm text-[#4b5563] leading-relaxed font-light'>
                  Think about this question for a moment before revealing the ideal answer below.
                </p>
              </div>
            </div>
          </div>

          {/* Reveal / Hide Answer Button */}
          <div className='flex justify-center'>
            <Button
              onClick={() => toggleReveal(activeIndex)}
              className={`
                h-12 px-8 rounded-[28px] font-medium transition-all duration-300 text-base
                ${isRevealed
                  ? 'bg-[#f0ebf5] hover:bg-[#e5ddf0] text-[#5b4a6b] border-2 border-[#ddd5e8]'
                  : 'bg-[#5b4a6b] hover:bg-[#3d2d4a] text-white shadow-soft hover:shadow-md'
                }
              `}
            >
              {isRevealed ? (
                <span className='flex items-center gap-2'>
                  <EyeOff className='w-5 h-5' /> Hide Answer
                </span>
              ) : (
                <span className='flex items-center gap-2'>
                  <Eye className='w-5 h-5' /> Reveal Ideal Answer
                </span>
              )}
            </Button>
          </div>

          {/* Ideal Answer */}
          {isRevealed && (
            <div className='space-y-5 animate-in fade-in duration-500'>
              {/* Full answer */}
              <div className='bg-gradient-to-br from-[#e8f5e9] to-[#f1f8f2] p-6 rounded-[24px] border-2 border-[#c3e6cb]'>
                <div className='flex items-center justify-between mb-3'>
                  <h4 className='font-medium text-[#2d5f5f] flex items-center gap-2'>
                    <BookOpen className='w-5 h-5' />
                    Ideal Answer
                  </h4>
                  <button
                    onClick={() => speakText(currentQ.answer)}
                    className='w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-[#e8f5e9] transition-all shadow-soft group flex-shrink-0'
                    title='Listen to answer'
                  >
                    <Volume2 className='w-4 h-4 text-[#2d5f5f] group-hover:scale-110 transition-transform' />
                  </button>
                </div>
                <p className='text-[#1f2937] leading-relaxed'>
                  {currentQ.answer}
                </p>
              </div>

              {/* Key points */}
              <div className='bg-white p-5 rounded-[20px] border-2 border-[#ddd5e8]'>
                <h4 className='font-medium text-[#5b4a6b] mb-3 flex items-center gap-2'>
                  <CheckCircle2 className='w-5 h-5' />
                  Key Points to Remember
                </h4>
                <ul className='space-y-2'>
                  {currentQ.keyPoints.map((point, i) => (
                    <li key={i} className='flex items-start gap-3'>
                      <span className='w-6 h-6 rounded-full bg-[#5b4a6b] text-white text-xs font-semibold flex items-center justify-center flex-shrink-0 mt-0.5'>
                        {i + 1}
                      </span>
                      <span className='text-[#4b5563] text-sm leading-relaxed'>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className='flex justify-between items-center pt-6 border-t border-[#f0e6db]'>
          <div>
            {activeIndex > 0 && (
              <Button
                variant='outline'
                onClick={() => setActiveIndex(activeIndex - 1)}
                className='rounded-[20px] border-[#ddd5e8] hover:border-[#5b4a6b] hover:bg-[#f0ebf5] text-[#1f2937] font-medium transition-all duration-300'
              >
                <ArrowLeft className='w-4 h-4 mr-2' />
                Previous
              </Button>
            )}
          </div>
          <div className='flex gap-4'>
            {activeIndex < DRESSING_POSTURE_QUESTIONS.length - 1 && (
              <Button
                onClick={() => setActiveIndex(activeIndex + 1)}
                className='rounded-[28px] bg-[#5b4a6b] hover:bg-[#3d2d4a] text-white font-medium shadow-soft hover:shadow-md transition-all duration-300'
              >
                Next Question
                <ArrowRight className='w-4 h-4 ml-2' />
              </Button>
            )}
            {activeIndex === DRESSING_POSTURE_QUESTIONS.length - 1 && (
              <Link href='/dashboard'>
                <Button className='rounded-[28px] bg-[#4a6b5b] hover:bg-[#2d4a3d] text-white font-medium shadow-soft hover:shadow-md transition-all duration-300'>
                  <ArrowLeft className='w-4 h-4 mr-2' />
                  Back to Dashboard
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DressingPosturePractice;
