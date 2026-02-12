/**
 * Confidence Analyzer  v2
 *
 * Estimates a speaker's confidence from transcribed speech.
 * Uses a multi-signal, weighted approach so that no single metric
 * can dominate the score.
 *
 * Signals (positive & negative):
 *   + Vocabulary richness (unique-word ratio)
 *   + Answer substance (word count, sentence count)
 *   + Structural clarity (sentences of reasonable length)
 *   + Assertive language ("I believe", "In my experience", etc.)
 *   + Steady pace (words-per-second in the normal range)
 *   - True filler words (uh, um, hmm — NOT contextual words like "like" or "right")
 *   - Word-level repetition / stammering
 *   - Excessive hedging ("I guess", "maybe", "not sure")
 *   - Trailing off
 *
 * Score range: 0 – 100
 */

// ─── Filler / hedging dictionaries ──────────────────────────────
// Only words that are almost always fillers, not contextual vocabulary.
const TRUE_FILLERS = [
  'uh', 'um', 'umm', 'uhh', 'er', 'ah', 'hmm', 'hm',
  'so yeah', 'okay so', 'you know',
];

// Hedging phrases — penalised lightly because they can be valid in speech.
const HEDGE_PHRASES = [
  'i guess', 'i think maybe', 'i\'m not sure', 'not really sure',
  'kind of', 'sort of', 'maybe', 'probably', 'i suppose',
];

// Assertive / confident phrases — rewarded.
const ASSERTIVE_PHRASES = [
  'i believe', 'in my experience', 'i have worked with',
  'i implemented', 'i built', 'i designed', 'i led',
  'the key point is', 'the main reason', 'for example',
  'specifically', 'in particular', 'this is because',
  'the advantage is', 'the benefit is', 'what i did was',
  'i am confident', 'i would approach', 'my approach would be',
  'first', 'second', 'third', 'finally', 'to summarize',
  'in conclusion', 'to sum up',
];

// ─── Helper: count phrase occurrences ───────────────────────────
function countPhrases(text, phrases) {
  const lower = text.toLowerCase();
  let count = 0;
  for (const phrase of phrases) {
    const regex = new RegExp(`\\b${phrase}\\b`, 'gi');
    const matches = lower.match(regex);
    if (matches) count += matches.length;
  }
  return count;
}

// ─── Helper: count repeated consecutive words (stammering) ──────
function countRepetitions(text) {
  const words = text.toLowerCase().split(/\s+/);
  let reps = 0;
  for (let i = 1; i < words.length; i++) {
    if (words[i] === words[i - 1] && words[i].length > 1) reps++;
  }
  return reps;
}

// ─── Helper: count sentences ────────────────────────────────────
function countSentences(text) {
  return text.split(/[.!?]+/).filter((s) => s.trim().length > 3).length;
}

// ─── Helper: vocabulary richness (type-token ratio) ─────────────
function vocabRichness(text) {
  const words = text.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return 0;
  const unique = new Set(words);
  return unique.size / words.length; // 0-1, higher = richer
}

// ─── Helper: detect trailing off ("...", "um..." at end) ────────
function hasTrailingOff(text) {
  const trimmed = text.trim();
  return trimmed.endsWith('...') || trimmed.endsWith('um') || trimmed.endsWith('uh');
}

/**
 * Main analysis function.
 *
 * @param {string} answer       - The transcribed answer text.
 * @param {number} durationSec  - Recording duration in seconds (optional).
 * @returns {{ score: number, level: string, metrics: object, tips: string[] }}
 */
export function analyzeConfidence(answer, durationSec = null) {
  if (!answer || answer.trim().length < 5) {
    return {
      score: 0,
      level: 'Low',
      metrics: {},
      tips: ['Try to give a longer, more detailed answer.'],
    };
  }

  const words = answer.trim().split(/\s+/);
  const wordCount = words.length;
  const fillerCount = countPhrases(answer, TRUE_FILLERS);
  const hedgeCount = countPhrases(answer, HEDGE_PHRASES);
  const assertiveCount = countPhrases(answer, ASSERTIVE_PHRASES);
  const repetitionCount = countRepetitions(answer);
  const sentenceCount = countSentences(answer);
  const fillerRatio = wordCount > 0 ? fillerCount / wordCount : 0;
  const hedgeRatio = wordCount > 0 ? hedgeCount / wordCount : 0;
  const wordsPerSentence = sentenceCount > 0 ? wordCount / sentenceCount : wordCount;
  const richness = vocabRichness(answer);
  const trailingOff = hasTrailingOff(answer);

  let pace = null;
  if (durationSec && durationSec > 0) {
    pace = wordCount / durationSec;
  }

  // ───────────────────────────────────────────────────────────────
  // Weighted scoring: start at a base of 55 (average), then adjust.
  // This avoids the "start at 100 and punish everything" pattern,
  // which unfairly tanks spoken answers.
  // ───────────────────────────────────────────────────────────────
  let score = 55;

  // ── POSITIVE signals (can add up to ~45) ──

  // Substance bonus (0-15): longer answers show confidence
  if (wordCount >= 100) score += 15;
  else if (wordCount >= 60) score += 12;
  else if (wordCount >= 40) score += 8;
  else if (wordCount >= 25) score += 4;

  // Structure bonus (0-10): multiple well-formed sentences
  if (sentenceCount >= 4 && wordsPerSentence >= 8 && wordsPerSentence <= 30) score += 10;
  else if (sentenceCount >= 2 && wordsPerSentence >= 6) score += 6;
  else if (sentenceCount >= 1) score += 2;

  // Vocabulary richness bonus (0-8)
  if (richness >= 0.7) score += 8;
  else if (richness >= 0.55) score += 5;
  else if (richness >= 0.4) score += 2;

  // Assertive language bonus (0-8)
  if (assertiveCount >= 4) score += 8;
  else if (assertiveCount >= 2) score += 5;
  else if (assertiveCount >= 1) score += 3;

  // Good pace bonus (0-4): 1.5 – 3.0 wps is the ideal speaking range
  if (pace !== null) {
    if (pace >= 1.5 && pace <= 3.0) score += 4;
    else if (pace >= 1.0 && pace <= 3.5) score += 2;
  }

  // ── NEGATIVE signals (can deduct up to ~45) ──

  // Filler penalty: only true fillers, lighter touch
  // 1-2 fillers are normal in speech — don't penalize
  const excessFillers = Math.max(0, fillerCount - 2);
  score -= excessFillers * 2;
  if (fillerRatio > 0.12) score -= 8;
  else if (fillerRatio > 0.08) score -= 4;

  // Hedging penalty (lighter than fillers — hedging can be valid)
  if (hedgeRatio > 0.08) score -= 6;
  else if (hedgeCount > 3) score -= 3;

  // Repetition / stammering penalty
  if (repetitionCount > 3) score -= 8;
  else if (repetitionCount > 1) score -= repetitionCount * 2;

  // Very short answer penalty
  if (wordCount < 10) score -= 20;
  else if (wordCount < 15) score -= 10;

  // Run-on or fragmented sentence penalty
  if (wordsPerSentence > 45) score -= 6;
  else if (wordsPerSentence > 35) score -= 3;
  if (sentenceCount > 0 && wordsPerSentence < 4) score -= 4;

  // Trailing off penalty
  if (trailingOff) score -= 4;

  // Extreme pace penalty
  if (pace !== null) {
    if (pace > 4.0) score -= 6;      // very fast → nervous
    else if (pace < 0.6) score -= 6;  // very slow → uncertain
  }

  // ── Clamp to 0–100 ──
  score = Math.max(0, Math.min(100, Math.round(score)));

  // ── Level ──
  let level;
  if (score >= 80) level = 'Very High';
  else if (score >= 60) level = 'High';
  else if (score >= 40) level = 'Moderate';
  else if (score >= 20) level = 'Low';
  else level = 'Very Low';

  // ── Tips (constructive and specific) ──
  const tips = [];
  if (excessFillers > 0)
    tips.push(`You used ${fillerCount} filler words (uh, um…). A couple is normal — try pausing silently instead of filling gaps.`);
  if (hedgeCount > 2)
    tips.push(`You hedged ${hedgeCount} times ("I guess", "maybe"…). Using more definitive language will sound more confident.`);
  if (repetitionCount > 1)
    tips.push(`You repeated words ${repetitionCount} times. Take a breath before continuing to avoid stammering.`);
  if (wordCount < 25)
    tips.push('Your answer was quite short. Try to elaborate with examples or reasoning to show depth.');
  if (wordCount >= 25 && wordCount < 40)
    tips.push('Consider adding a specific example or use case to strengthen your answer.');
  if (pace && pace > 3.5)
    tips.push('You spoke a bit fast. Slowing down makes you sound more deliberate and confident.');
  if (pace && pace < 0.8)
    tips.push('Your pace was quite slow. A slightly faster, steady rhythm sounds more natural.');
  if (wordsPerSentence > 35)
    tips.push('Your sentences were very long. Breaking them into shorter points improves clarity.');
  if (assertiveCount === 0 && wordCount >= 20)
    tips.push('Try leading with phrases like "In my experience…" or "The key point is…" to project confidence.');
  if (trailingOff)
    tips.push('Your answer trailed off at the end. Finish with a clear concluding statement.');
  if (tips.length === 0)
    tips.push('Great job! Your delivery sounds confident, structured, and well-paced.');

  // ── Detailed Speech Coaching ──
  const speechCoaching = generateSpeechCoaching({
    wordCount, fillerCount, hedgeCount, assertiveCount, repetitionCount,
    sentenceCount, wordsPerSentence, richness, pace, trailingOff, fillerRatio, score,
  });

  return {
    score,
    level,
    metrics: {
      wordCount,
      fillerCount,
      fillerRatio: +(fillerRatio * 100).toFixed(1),
      hedgeCount,
      assertiveCount,
      repetitionCount,
      sentenceCount,
      wordsPerSentence: +wordsPerSentence.toFixed(1),
      vocabRichness: +(richness * 100).toFixed(1),
      pace: pace ? +pace.toFixed(2) : null,
    },
    tips,
    speechCoaching,
  };
}

/**
 * Generate detailed speech coaching feedback broken into categories.
 */
function generateSpeechCoaching(m) {
  const coaching = {};

  // ── Pace & Rhythm ──
  if (m.pace) {
    if (m.pace >= 1.5 && m.pace <= 3.0) {
      coaching.paceAndRhythm = { status: 'good', message: `Your speaking pace (${m.pace.toFixed(1)} words/sec) is in the ideal range. You sound natural and composed.` };
    } else if (m.pace > 3.0) {
      coaching.paceAndRhythm = { status: 'warning', message: `You spoke at ${m.pace.toFixed(1)} words/sec — that's a bit fast. In interviews, aim for 1.5–3.0 words/sec. Pause briefly between key points to let the interviewer absorb your answer.` };
    } else {
      coaching.paceAndRhythm = { status: 'warning', message: `Your pace was ${m.pace.toFixed(1)} words/sec — a bit slow. While thoughtfulness is good, too many long pauses may seem uncertain. Try to maintain a steady, natural rhythm.` };
    }
  } else {
    coaching.paceAndRhythm = { status: 'info', message: 'Pace data not available. For best results, speak for at least 10 seconds.' };
  }

  // ── Clarity & Structure ──
  if (m.sentenceCount >= 3 && m.wordsPerSentence >= 8 && m.wordsPerSentence <= 25) {
    coaching.clarity = { status: 'good', message: `Excellent structure! You used ${m.sentenceCount} well-formed sentences averaging ${m.wordsPerSentence.toFixed(0)} words each. This makes your answer easy to follow.` };
  } else if (m.wordsPerSentence > 35) {
    coaching.clarity = { status: 'warning', message: `Your sentences averaged ${m.wordsPerSentence.toFixed(0)} words — that's very long. Break your answer into shorter, focused statements. Use the "point → explain → example" structure.` };
  } else if (m.sentenceCount <= 1 && m.wordCount >= 15) {
    coaching.clarity = { status: 'warning', message: 'Your answer came across as one long thought. Try to organize it into 2–3 distinct points. Start each point clearly, e.g., "First…", "Additionally…", "For example…"' };
  } else if (m.wordsPerSentence < 5 && m.sentenceCount > 0) {
    coaching.clarity = { status: 'warning', message: 'Your sentences were very short and fragmented. While being concise is good, try connecting your ideas into fuller thoughts to sound more authoritative.' };
  } else {
    coaching.clarity = { status: 'good', message: 'Your answer structure is reasonable. Keep organizing your thoughts into clear, distinct points.' };
  }

  // ── Vocabulary & Language ──
  const richnessPercent = (m.richness * 100).toFixed(0);
  if (m.richness >= 0.65) {
    coaching.vocabulary = { status: 'good', message: `Great vocabulary diversity (${richnessPercent}%)! You used varied and precise language, which makes your answer sound knowledgeable and professional.` };
  } else if (m.richness >= 0.45) {
    coaching.vocabulary = { status: 'info', message: `Your vocabulary diversity is moderate (${richnessPercent}%). Try using more specific technical terms and avoid repeating the same words. For example, instead of saying "good" repeatedly, use "effective", "efficient", "robust".` };
  } else {
    coaching.vocabulary = { status: 'warning', message: `Your vocabulary diversity is low (${richnessPercent}%). You repeated many of the same words. Using varied terminology and technical keywords shows deeper knowledge of the subject.` };
  }

  // ── Filler Words & Hesitation ──
  if (m.fillerCount <= 2) {
    coaching.fillers = { status: 'good', message: `Minimal filler words (${m.fillerCount}) — excellent! You sound polished and prepared.` };
  } else if (m.fillerCount <= 5) {
    coaching.fillers = { status: 'info', message: `You used ${m.fillerCount} filler words. That's fairly normal for spoken answers, but you can improve by: (1) pausing silently instead of saying "um", (2) taking a breath before starting a new thought, (3) practicing your key points aloud beforehand.` };
  } else {
    coaching.fillers = { status: 'warning', message: `You used ${m.fillerCount} filler words, which is noticeably high. This can make you seem unsure. Practice the "power pause" technique — whenever you feel an "um" coming, just pause for 1 second instead. Silence is more confident than fillers.` };
  }

  // ── Assertiveness ──
  if (m.assertiveCount >= 3) {
    coaching.assertiveness = { status: 'good', message: `You used ${m.assertiveCount} assertive phrases — great! Statements like "In my experience" and "For example" show confidence and authority.` };
  } else if (m.assertiveCount >= 1) {
    coaching.assertiveness = { status: 'info', message: `You used ${m.assertiveCount} assertive phrase(s). To sound more confident, start your answer with "The key approach is…" or "Based on my experience…". Back up claims with "For example…" or "Specifically…".` };
  } else if (m.wordCount >= 15) {
    coaching.assertiveness = { status: 'warning', message: 'Your answer lacked assertive language. You can seem more confident by: (1) starting with "I believe…", "In my experience…", (2) using "specifically" and "for example" to ground your points, (3) concluding with "To summarize…" or "The main takeaway is…".' };
  }

  // ── Answer Depth ──
  if (m.wordCount >= 80) {
    coaching.depth = { status: 'good', message: `Thorough answer with ${m.wordCount} words! You provided substantial detail — interviewers appreciate this level of depth.` };
  } else if (m.wordCount >= 40) {
    coaching.depth = { status: 'good', message: `Solid answer length (${m.wordCount} words). If you want to go further, consider adding a real-world example or discussing trade-offs.` };
  } else if (m.wordCount >= 20) {
    coaching.depth = { status: 'info', message: `Your answer was ${m.wordCount} words — a bit brief. Most strong interview answers are 40–100 words. Try the STAR method (Situation → Task → Action → Result) to add more substance.` };
  } else {
    coaching.depth = { status: 'warning', message: `Only ${m.wordCount} words. In technical interviews, elaborate on your reasoning. Explain WHY you chose an approach, not just WHAT it is. Add examples, trade-offs, or comparisons.` };
  }

  // ── Overall Impression ──
  if (m.score >= 80) {
    coaching.overall = { status: 'good', message: 'Your delivery is interview-ready! You communicate clearly, confidently, and at a great pace. Keep it up.' };
  } else if (m.score >= 60) {
    coaching.overall = { status: 'info', message: 'Your delivery is good with room for polish. Focus on reducing fillers and adding more structure to move from "good" to "impressive".' };
  } else if (m.score >= 40) {
    coaching.overall = { status: 'warning', message: 'Your delivery needs some work. The core ideas may be there, but the presentation could be improved. Practice speaking your answers aloud — even 5 minutes of daily practice makes a big difference.' };
  } else {
    coaching.overall = { status: 'warning', message: 'Your delivery needs significant improvement. Consider rehearsing common questions aloud, recording yourself, and reviewing the playback. Focus on speaking in complete sentences and using the "point, explain, example" pattern.' };
  }

  return coaching;
}

/**
 * Get the colour class for the confidence score.
 */
export function getConfidenceColor(score) {
  if (score >= 80) return 'text-[#16a34a]';   // green
  if (score >= 60) return 'text-[#2d5f5f]';   // teal
  if (score >= 40) return 'text-[#d97706]';   // amber
  return 'text-[#b91c1c]';                    // red
}

/**
 * Get a background/badge colour for the confidence level.
 */
export function getConfidenceBgColor(score) {
  if (score >= 80) return 'bg-[#dcfce7] border-[#bbf7d0] text-[#16a34a]';
  if (score >= 60) return 'bg-[#e0f2f1] border-[#b2dfdb] text-[#2d5f5f]';
  if (score >= 40) return 'bg-[#fef3c7] border-[#fde68a] text-[#d97706]';
  return 'bg-[#fef2f2] border-[#fecaca] text-[#b91c1c]';
}
