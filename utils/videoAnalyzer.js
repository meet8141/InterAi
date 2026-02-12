/**
 * Video / Camera Analyzer
 *
 * Captures a frame from the webcam and analyzes it for interview presentation quality:
 *   - Brightness (is the scene well-lit?)
 *   - Contrast (can the face stand out from background?)
 *   - Face centering (is there a face-like region roughly in the centre?)
 *   - Background uniformity (distracting vs clean background?)
 *   - Blur detection (is the image sharp enough?)
 *
 * This uses raw Canvas pixel analysis — no external ML/face-detection library required.
 * It gives practical, actionable feedback for interview preparation.
 */

// ─── Capture a frame from the webcam ref ────────────────────────
export function captureFrame(webcamRef) {
  if (!webcamRef?.current) return null;
  try {
    const screenshot = webcamRef.current.getScreenshot({ width: 320, height: 240 });
    return screenshot; // base64 data URL
  } catch {
    return null;
  }
}

// ─── Load a base64 image into ImageData ─────────────────────────
function imageDataFromBase64(base64) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      resolve(ctx.getImageData(0, 0, canvas.width, canvas.height));
    };
    img.onerror = reject;
    img.src = base64;
  });
}

// ─── Brightness (average luminance 0-255) ───────────────────────
function analyzeBrightness(data, width, height) {
  let total = 0;
  const pixels = data.data;
  const count = width * height;
  for (let i = 0; i < pixels.length; i += 4) {
    // Perceived luminance: 0.299R + 0.587G + 0.114B
    total += 0.299 * pixels[i] + 0.587 * pixels[i + 1] + 0.114 * pixels[i + 2];
  }
  return total / count;
}

// ─── Contrast (standard deviation of luminance) ─────────────────
function analyzeContrast(data, width, height, avgBrightness) {
  let variance = 0;
  const pixels = data.data;
  const count = width * height;
  for (let i = 0; i < pixels.length; i += 4) {
    const lum = 0.299 * pixels[i] + 0.587 * pixels[i + 1] + 0.114 * pixels[i + 2];
    variance += (lum - avgBrightness) ** 2;
  }
  return Math.sqrt(variance / count);
}

// ─── Face region detection (skin-tone heuristic in center) ──────
function analyzeFacePresence(data, width, height) {
  // Check the central 40% of the frame for skin-tone pixels
  const x1 = Math.floor(width * 0.3);
  const x2 = Math.floor(width * 0.7);
  const y1 = Math.floor(height * 0.1);
  const y2 = Math.floor(height * 0.6);
  const pixels = data.data;

  let skinPixels = 0;
  let totalChecked = 0;

  for (let y = y1; y < y2; y++) {
    for (let x = x1; x < x2; x++) {
      const idx = (y * width + x) * 4;
      const r = pixels[idx];
      const g = pixels[idx + 1];
      const b = pixels[idx + 2];

      // Broad skin-tone detection in RGB space (works across skin tones)
      if (isSkinTone(r, g, b)) {
        skinPixels++;
      }
      totalChecked++;
    }
  }

  const skinRatio = totalChecked > 0 ? skinPixels / totalChecked : 0;
  return { skinRatio, skinPixels, totalChecked };
}

// Skin-tone classifier — intentionally broad to work across ethnicities
function isSkinTone(r, g, b) {
  // Rule-based skin detection (Peer et al. + extended)
  // Works reasonably well for most skin tones under decent lighting
  return (
    r > 60 && g > 40 && b > 20 &&
    r > g && r > b &&
    Math.abs(r - g) > 10 &&
    r - b > 15 &&
    (r - g) < 120  // prevent red objects from matching
  );
}

// ─── Background uniformity (edge density in outer regions) ──────
function analyzeBackground(data, width, height) {
  // Check edge density in the outer border (25% frame)
  const pixels = data.data;
  let edgeCount = 0;
  let totalChecked = 0;

  const isOuter = (x, y) =>
    x < width * 0.2 || x > width * 0.8 || y < height * 0.15 || y > height * 0.85;

  for (let y = 1; y < height - 1; y += 2) {
    for (let x = 1; x < width - 1; x += 2) {
      if (!isOuter(x, y)) continue;
      totalChecked++;

      const idx = (y * width + x) * 4;
      const idxRight = (y * width + x + 1) * 4;
      const idxBelow = ((y + 1) * width + x) * 4;

      const lum = 0.299 * pixels[idx] + 0.587 * pixels[idx + 1] + 0.114 * pixels[idx + 2];
      const lumR = 0.299 * pixels[idxRight] + 0.587 * pixels[idxRight + 1] + 0.114 * pixels[idxRight + 2];
      const lumB = 0.299 * pixels[idxBelow] + 0.587 * pixels[idxBelow + 1] + 0.114 * pixels[idxBelow + 2];

      if (Math.abs(lum - lumR) > 20 || Math.abs(lum - lumB) > 20) {
        edgeCount++;
      }
    }
  }

  const edgeRatio = totalChecked > 0 ? edgeCount / totalChecked : 0;
  return edgeRatio;
}

// ─── Blur detection (Laplacian variance) ────────────────────────
function analyzeSharpness(data, width, height) {
  const pixels = data.data;
  let lapVariance = 0;
  let count = 0;

  for (let y = 1; y < height - 1; y += 2) {
    for (let x = 1; x < width - 1; x += 2) {
      const getLum = (px, py) => {
        const i = (py * width + px) * 4;
        return 0.299 * pixels[i] + 0.587 * pixels[i + 1] + 0.114 * pixels[i + 2];
      };

      // Laplacian: center * 4 - top - bottom - left - right
      const lap = 4 * getLum(x, y) - getLum(x - 1, y) - getLum(x + 1, y) - getLum(x, y - 1) - getLum(x, y + 1);
      lapVariance += lap * lap;
      count++;
    }
  }

  return count > 0 ? Math.sqrt(lapVariance / count) : 0;
}

/**
 * Main video analysis function.
 * Pass a base64 screenshot from the webcam.
 *
 * @param {string} base64Image - Base64 data URL from webcam.getScreenshot()
 * @returns {Promise<{
 *   score: number,
 *   level: string,
 *   checks: object,
 *   tips: string[]
 * }>}
 */
export async function analyzeVideoFrame(base64Image) {
  if (!base64Image) {
    return {
      score: 0,
      level: 'No Camera',
      checks: {},
      tips: ['Camera is not available. Please enable your webcam for video feedback.'],
    };
  }

  let imageData;
  try {
    imageData = await imageDataFromBase64(base64Image);
  } catch {
    return {
      score: 0,
      level: 'Error',
      checks: {},
      tips: ['Could not process webcam frame. Please check your camera.'],
    };
  }

  const { width, height } = imageData;
  const brightness = analyzeBrightness(imageData, width, height);
  const contrast = analyzeContrast(imageData, width, height, brightness);
  const face = analyzeFacePresence(imageData, width, height);
  const bgEdgeRatio = analyzeBackground(imageData, width, height);
  const sharpness = analyzeSharpness(imageData, width, height);

  // ── Scoring ──
  let score = 50;
  const checks = {};

  // Brightness (ideal: 90–180)
  if (brightness >= 90 && brightness <= 180) {
    score += 12;
    checks.lighting = { status: 'good', value: Math.round(brightness), message: 'Your lighting is good — your face is clearly visible.' };
  } else if (brightness < 60) {
    score -= 12;
    checks.lighting = { status: 'poor', value: Math.round(brightness), message: 'Your scene is too dark. Move to a well-lit area or add a desk lamp facing you. Natural light from a window in front of you works best.' };
  } else if (brightness > 200) {
    score -= 8;
    checks.lighting = { status: 'warning', value: Math.round(brightness), message: 'Your scene is overexposed / too bright. Avoid sitting directly in front of a window or strong light source. Position the light in front of you, not behind.' };
  } else if (brightness < 90) {
    score -= 4;
    checks.lighting = { status: 'warning', value: Math.round(brightness), message: 'Your lighting is a bit dim. Try increasing room light or positioning a light source in front of you for a clearer image.' };
  } else {
    score += 4;
    checks.lighting = { status: 'info', value: Math.round(brightness), message: 'Lighting is acceptable but could be better. A well-lit face makes a stronger impression.' };
  }

  // Contrast (ideal: 30-70)
  if (contrast >= 30 && contrast <= 70) {
    score += 8;
    checks.contrast = { status: 'good', value: Math.round(contrast), message: 'Good contrast — your face stands out well from the background.' };
  } else if (contrast < 20) {
    score -= 6;
    checks.contrast = { status: 'warning', value: Math.round(contrast), message: 'Low contrast — your image looks flat. Make sure there is some separation between you and your background (different colors/tones).' };
  } else {
    score += 2;
    checks.contrast = { status: 'info', value: Math.round(contrast), message: 'Contrast is acceptable.' };
  }

  // Face presence (skin ratio in center > 0.15 is good)
  if (face.skinRatio >= 0.15) {
    score += 15;
    checks.faceVisibility = { status: 'good', value: +(face.skinRatio * 100).toFixed(1), message: 'Your face is clearly visible and well-centered in the frame. Great positioning!' };
  } else if (face.skinRatio >= 0.05) {
    score += 5;
    checks.faceVisibility = { status: 'warning', value: +(face.skinRatio * 100).toFixed(1), message: 'Your face is partially visible but may not be well-centered. Position yourself so your head and shoulders fill the center of the frame. Keep your eyes at roughly the top third of the video.' };
  } else {
    score -= 10;
    checks.faceVisibility = { status: 'poor', value: +(face.skinRatio * 100).toFixed(1), message: 'Your face is not clearly visible. Make sure you are sitting directly in front of the camera, at arm\'s length distance. Ensure adequate lighting on your face, and avoid backlighting.' };
  }

  // Background (edge ratio < 0.25 = clean, > 0.45 = distracting)
  if (bgEdgeRatio < 0.25) {
    score += 10;
    checks.background = { status: 'good', value: +(bgEdgeRatio * 100).toFixed(1), message: 'Clean, professional background. This helps the interviewer focus on you.' };
  } else if (bgEdgeRatio < 0.40) {
    score += 3;
    checks.background = { status: 'info', value: +(bgEdgeRatio * 100).toFixed(1), message: 'Your background is slightly busy. If possible, use a plain wall or a tidy, uncluttered area behind you. A neutral background looks the most professional.' };
  } else {
    score -= 8;
    checks.background = { status: 'warning', value: +(bgEdgeRatio * 100).toFixed(1), message: 'Your background is cluttered or distracting. Try to find a clean, neutral wall behind you. If that\'s not possible, use a virtual background. Avoid having people or moving objects visible behind you.' };
  }

  // Sharpness (Laplacian std dev; > 15 = sharp, < 8 = blurry)
  if (sharpness >= 15) {
    score += 5;
    checks.imageClarity = { status: 'good', value: Math.round(sharpness), message: 'Camera image is clear and sharp. Your expressions will be easily visible.' };
  } else if (sharpness >= 8) {
    score += 2;
    checks.imageClarity = { status: 'info', value: Math.round(sharpness), message: 'Image is slightly soft. Clean your camera lens and ensure good lighting for a sharper picture.' };
  } else {
    score -= 6;
    checks.imageClarity = { status: 'poor', value: Math.round(sharpness), message: 'Your camera image is blurry. Clean the camera lens, ensure good lighting, and sit still. If using a laptop, make sure the webcam is not smudged.' };
  }

  // Clamp
  score = Math.max(0, Math.min(100, Math.round(score)));

  // Level
  let level;
  if (score >= 80) level = 'Excellent';
  else if (score >= 60) level = 'Good';
  else if (score >= 40) level = 'Fair';
  else level = 'Needs Improvement';

  // Compile top tips
  const tips = [];
  const checkOrder = ['faceVisibility', 'lighting', 'background', 'imageClarity', 'contrast'];
  for (const key of checkOrder) {
    if (checks[key] && (checks[key].status === 'poor' || checks[key].status === 'warning')) {
      tips.push(checks[key].message);
    }
  }
  if (tips.length === 0) {
    tips.push('Your video setup looks great! You have good lighting, a clear face, and a clean background. You\'re ready for the interview.');
  }

  return { score, level, checks, tips };
}

/**
 * Get the colour class for the video score.
 */
export function getVideoScoreColor(score) {
  if (score >= 80) return 'text-[#16a34a]';
  if (score >= 60) return 'text-[#2d5f5f]';
  if (score >= 40) return 'text-[#d97706]';
  return 'text-[#b91c1c]';
}

export function getVideoScoreBgColor(score) {
  if (score >= 80) return 'bg-[#dcfce7] border-[#bbf7d0] text-[#16a34a]';
  if (score >= 60) return 'bg-[#e0f2f1] border-[#b2dfdb] text-[#2d5f5f]';
  if (score >= 40) return 'bg-[#fef3c7] border-[#fde68a] text-[#d97706]';
  return 'bg-[#fef2f2] border-[#fecaca] text-[#b91c1c]';
}

// Status icon helper
export function getCheckStatusIcon(status) {
  if (status === 'good') return '✅';
  if (status === 'info') return 'ℹ️';
  if (status === 'warning') return '⚠️';
  if (status === 'poor') return '❌';
  return '•';
}
