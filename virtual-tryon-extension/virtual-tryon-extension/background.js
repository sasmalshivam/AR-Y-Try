// background.js - Service Worker (Manifest V3)

// ─── Context Menu Setup ───────────────────────────────────────────────────────
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "virtualTryOn",
    title: "👗 Virtual Try-On",
    contexts: ["image"],
  });

  chrome.contextMenus.create({
    id: "virtualTryOnSeparator",
    type: "separator",
    contexts: ["image"],
  });

  chrome.contextMenus.create({
    id: "virtualTryOnAR",
    title: "📷 Live AR Try-On",
    contexts: ["image"],
  });

  console.log("[VirtualTryOn] Extension installed. Context menus created.");
});

// ─── Context Menu Click Handler ───────────────────────────────────────────────
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (!tab?.id) return;

  if (info.menuItemId === "virtualTryOn") {
    chrome.tabs.sendMessage(tab.id, {
      action: "openTryOnModal",
      clothingImageUrl: info.srcUrl,
      mode: "ai",
    });
  }

  if (info.menuItemId === "virtualTryOnAR") {
    chrome.tabs.sendMessage(tab.id, {
      action: "openTryOnModal",
      clothingImageUrl: info.srcUrl,
      mode: "ar",
    });
  }
});

// ─── Message Handler ──────────────────────────────────────────────────────────
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "generateTryOn") {
    handleGeminiTryOn(message.data)
      .then((result) => sendResponse({ success: true, data: result }))
      .catch((err) => sendResponse({ success: false, error: err.message }));
    return true; // Keep channel open for async
  }

  if (message.action === "getApiKey") {
    chrome.storage.sync.get(["geminiApiKey"], (result) => {
      sendResponse({ apiKey: result.geminiApiKey || null });
    });
    return true;
  }

  if (message.action === "saveApiKey") {
    chrome.storage.sync.set({ geminiApiKey: message.apiKey }, () => {
      sendResponse({ success: true });
    });
    return true;
  }

  if (message.action === "openPopupForKey") {
    chrome.action.openPopup();
    sendResponse({ success: true });
    return true;
  }
});

// ─── Gemini API Integration ───────────────────────────────────────────────────
async function handleGeminiTryOn({ userImageBase64, clothingImageBase64, userMimeType, clothingMimeType }) {
  const { geminiApiKey } = await chrome.storage.sync.get(["geminiApiKey"]);

  if (!geminiApiKey) {
    throw new Error("NO_API_KEY");
  }

  const GEMINI_MODEL = "gemini-2.0-flash-exp";
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${geminiApiKey}`;

  const prompt = `You are a professional fashion AI. Your task is virtual clothing try-on.

TASK: Apply the clothing item from Image 2 onto the person in Image 1.

STRICT REQUIREMENTS:
- Preserve the person's face EXACTLY (no changes to facial features, expression, or identity)
- Preserve the person's pose, body proportions, and position EXACTLY  
- Preserve the background and lighting environment
- ONLY replace/swap the clothing item
- The clothing must appear naturally fitted to the person's body
- Apply realistic lighting, shadows, and fabric texture from the original clothing
- Ensure proper edge blending between clothing and body
- The result must look like a professional fashion photograph
- Do NOT add any text, watermarks, or artifacts to the image

OUTPUT: A single photorealistic image showing the person wearing the clothing from Image 2.`;

  const requestBody = {
    contents: [
      {
        parts: [
          {
            inline_data: {
              mime_type: userMimeType || "image/jpeg",
              data: userImageBase64,
            },
          },
          {
            inline_data: {
              mime_type: clothingMimeType || "image/jpeg",
              data: clothingImageBase64,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
      responseModalities: ["IMAGE", "TEXT"],
      responseMimeType: "text/plain",
    },
    safetySettings: [
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
    ],
  };

  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMsg = errorData?.error?.message || `HTTP ${response.status}`;
    
    if (response.status === 400) throw new Error(`API Error: ${errorMsg}`);
    if (response.status === 403) throw new Error("Invalid API key. Please check your Gemini API key.");
    if (response.status === 429) throw new Error("Rate limit exceeded. Please wait a moment and try again.");
    throw new Error(`Gemini API Error: ${errorMsg}`);
  }

  const data = await response.json();

  // Extract generated image from response
  const candidates = data?.candidates;
  if (!candidates || candidates.length === 0) {
    throw new Error("No response generated. The AI may have refused the request.");
  }

  const parts = candidates[0]?.content?.parts || [];
  
  // Look for image part
  for (const part of parts) {
    if (part.inlineData && part.inlineData.mimeType?.startsWith("image/")) {
      return {
        type: "image",
        mimeType: part.inlineData.mimeType,
        base64: part.inlineData.data,
      };
    }
  }

  // If no image, check for text (error message from model)
  for (const part of parts) {
    if (part.text) {
      throw new Error(`AI could not generate try-on: ${part.text}`);
    }
  }

  throw new Error("No image was generated. Try with different images.");
}
