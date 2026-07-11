export function buildGeminiRequest(prompt, apiKey) {
    return {
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        options: {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
            }),
        },
    };
}

export function extractGeminiText(response) {
    const candidates = response?.candidates ?? [];
    const firstCandidate = candidates[0];
    const firstPart = firstCandidate?.content?.parts?.[0];
    return firstPart?.text || 'No response was returned by Gemini.';
}
