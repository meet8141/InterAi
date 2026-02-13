import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} from "@google/generative-ai";

// ── API Key Pool ──────────────────────────────────────────────────────
// Supports multiple comma-separated keys in NEXT_PUBLIC_GEMINI_API_KEYS,
// with fallback to the single key in NEXT_PUBLIC_KEY_GEMINI.
const keyPool = (() => {
    const multi = process.env.NEXT_PUBLIC_GEMINI_API_KEYS;
    if (multi) {
        return multi.split(",").map((k) => k.trim()).filter(Boolean);
    }
    const single = process.env.NEXT_PUBLIC_KEY_GEMINI;
    if (single) {
        // Support comma-separated keys in the single-key env var too
        return single.split(",").map((k) => k.trim()).filter(Boolean);
    }
    return [];
})();

if (keyPool.length === 0) {
    console.error(
        "[Gemini] No API keys found. Set NEXT_PUBLIC_GEMINI_API_KEYS or NEXT_PUBLIC_KEY_GEMINI in your .env file."
    );
}

let currentKeyIndex = 0;

// ── Shared config ─────────────────────────────────────────────────────
const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

const safetySettings = [
    {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
];

// ── Helpers ───────────────────────────────────────────────────────────
/**
 * Returns true when the error indicates the API key is expired,
 * quota is exhausted, or the key is otherwise invalid — i.e. we
 * should rotate to the next key rather than surface the error.
 */
function isKeyExhaustedOrInvalid(error) {
    const msg = (error?.message || "").toLowerCase();
    const status = error?.status || error?.code || error?.httpCode;

    // HTTP 400 – invalid API key
    if (status === 400) return true;
    // HTTP 429 – rate-limit / resource exhausted
    if (status === 429) return true;
    // HTTP 403 – key disabled / billing issue
    if (status === 403) return true;

    // Google AI SDK sometimes wraps the status in the message text
    if (
        msg.includes("resource has been exhausted") ||
        msg.includes("resource_exhausted") ||
        msg.includes("quota") ||
        msg.includes("rate limit") ||
        msg.includes("api key not valid") ||
        msg.includes("api key expired") ||
        msg.includes("api_key_invalid") ||
        msg.includes("permission denied") ||
        msg.includes("billing")
    ) {
        return true;
    }

    return false;
}

/**
 * Build a fresh ChatSession for a given API key.
 */
function buildChatSession(apiKey) {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    return model.startChat({ generationConfig, safetySettings });
}

// ── Primary export: resilient sendMessage with auto-key-rotation ──────
/**
 * Send a prompt to Gemini. If the current key is exhausted / invalid,
 * automatically rotate to the next available key and retry.
 *
 * Returns the same result shape as `chatSession.sendMessage()`.
 *
 * @param {string} prompt
 * @returns {Promise<import("@google/generative-ai").GenerateContentResult>}
 */
export async function sendMessage(prompt) {
    const totalKeys = keyPool.length;
    if (totalKeys === 0) {
        throw new Error("[Gemini] No API keys configured.");
    }

    let lastError;

    for (let attempt = 0; attempt < totalKeys; attempt++) {
        const key = keyPool[currentKeyIndex];
        try {
            const session = buildChatSession(key);
            const result = await session.sendMessage(prompt);
            // Success — keep using this key next time
            return result;
        } catch (error) {
            lastError = error;
            console.warn(
                `[Gemini] Key #${currentKeyIndex + 1} failed: ${error?.message ?? error}`
            );

            if (isKeyExhaustedOrInvalid(error) && totalKeys > 1) {
                // Rotate to the next key
                currentKeyIndex = (currentKeyIndex + 1) % totalKeys;
                console.info(
                    `[Gemini] Rotating to key #${currentKeyIndex + 1} (${totalKeys} total)`
                );
                continue;
            }

            // Non-rotatable error — throw immediately
            throw error;
        }
    }

    // All keys exhausted
    console.error("[Gemini] All API keys exhausted.");
    throw lastError;
}

// ── Backward-compatible legacy export ─────────────────────────────────
// Kept so that any import of `chatSession` still works, but new code
// should prefer the `sendMessage` function above.
export const chatSession = keyPool.length > 0
    ? buildChatSession(keyPool[0])
    : null;
  