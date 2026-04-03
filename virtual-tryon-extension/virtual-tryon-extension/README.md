# 👗 Virtual Try-On AI — Chrome Extension

A production-level Chrome Extension (Manifest V3) that lets users virtually try on clothing from any e-commerce website using **Google Gemini AI** for realistic image generation and optional **live AR mode** via webcam.

---

## ✨ Features

| Feature | Status |
|---------|--------|
| 🤖 AI Try-On via Google Gemini | ✅ Core Feature |
| 📷 Webcam photo capture | ✅ Built-in |
| 📁 Photo upload (drag & drop) | ✅ Built-in |
| 🖱️ Right-click context menu | ✅ Built-in |
| 👗 Hover "Try On" button on product images | ✅ Built-in |
| 🔄 Before/After comparison | ✅ Built-in |
| ⬇️ Download result | ✅ Built-in |
| 📷 Live AR overlay mode | ✅ Basic AR |
| 🔑 Secure local API key storage | ✅ Chrome Storage |
| 🛡️ Privacy-first (no tracking) | ✅ |

---

## 🚀 Quick Setup

### Prerequisites
- Google Chrome (version 88+)
- A free Google Gemini API key

### Step 1: Get a Free Gemini API Key
1. Go to [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy your API key (starts with `AIza...`)

### Step 2: Load the Extension in Chrome
1. Open Chrome and navigate to: `chrome://extensions/`
2. Enable **"Developer mode"** (toggle in top-right corner)
3. Click **"Load unpacked"**
4. Select the `virtual-tryon-extension` folder
5. The extension icon (✦) will appear in your toolbar

### Step 3: Add Your API Key
1. Click the extension icon (✦) in the Chrome toolbar
2. Paste your Gemini API key
3. Click **"Save API Key"**
4. The status indicator turns green ✅

### Step 4: Try It Out!
- Visit any clothing website (Amazon, Myntra, ASOS, Zara, etc.)
- **Method 1**: Hover over any clothing image → click **"Try On"**
- **Method 2**: Right-click any clothing image → select **"Virtual Try-On"**

---

## 🗂️ File Structure

```
virtual-tryon-extension/
├── manifest.json          # Chrome Extension config (Manifest V3)
├── background.js          # Service worker: context menus + Gemini API calls
├── content.js             # Injected into pages: modal UI + webcam + hover buttons
├── content.css            # All modal and overlay styles
├── popup.html             # Extension popup: API key management
├── popup.js               # Popup logic: save/validate API key
├── generate-icons.html    # Browser tool to regenerate icons if needed
├── generate-icons.js      # Node.js icon generator script
├── README.md              # This file
└── icons/
    ├── icon16.png
    ├── icon32.png
    ├── icon48.png
    └── icon128.png
```

---

## 🎮 How to Use

### AI Try-On (Main Feature)
1. Find a clothing item on any shopping website
2. Hover over the product image → click **"👗 Try On"** button
   *(or right-click → "Virtual Try-On")*
3. In the modal:
   - Upload your photo OR click **"📷 Webcam"** to take a selfie
4. Click **"✦ Generate Try-On"**
5. Wait ~10-30 seconds for Gemini to generate the result
6. View, compare, and download your try-on image!

### AR Mode (Live Overlay)
1. Start try-on from any clothing image
2. Click **"📷 AR Mode"** toggle
3. Click **"Start AR Try-On"**
4. Use ➕➖↑↓ controls to position the clothing overlay
5. Click ■ to stop

---

## 🔧 Configuration

### Supported Websites
Works on all websites including:
- Amazon, Flipkart, Myntra
- ASOS, Zara, H&M, Shein
- Any website with clothing product images

### Gemini Model
The extension uses `gemini-2.0-flash-exp` for image generation.
To change the model, edit `background.js`:
```js
const GEMINI_MODEL = "gemini-2.0-flash-exp";
```

---

## 🛡️ Privacy & Security

- **Your API key** is stored only in Chrome's local storage (`chrome.storage.sync`)
- **Your photos** are processed entirely client-side; only sent to Google's Gemini API when you click Generate
- **No tracking**, analytics, or third-party services
- **No data retention**: images are not stored anywhere after the session

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "API Key Required" notice | Click the extension icon and add your Gemini API key |
| "Invalid API key" error | Ensure key starts with `AIza` and is from aistudio.google.com |
| Clothing image won't load | The image may be CORS-restricted; try right-clicking and using context menu |
| Camera not working | Allow camera permissions in Chrome settings |
| No "Try On" button appears | The image may be too small (<80px); try larger product images |
| Rate limit error | Wait 60 seconds and try again (free tier has limits) |
| Extension not loading | Ensure Developer Mode is ON in chrome://extensions/ |

---

## 🔮 Technical Details

### Architecture
- **Manifest V3** with service worker background script
- **Content Script** injected into all pages for DOM manipulation
- **Chrome Storage Sync** for cross-device API key sync
- **Gemini Multimodal API** with image+text input, image output

### AI Prompt Engineering
The extension sends this prompt to Gemini:
```
Apply the clothing item from Image 2 onto the person in Image 1.
- Preserve the person's face EXACTLY
- Preserve pose and body proportions
- ONLY replace the clothing
- Apply realistic lighting, shadows, and fabric texture
- Ensure proper edge blending
- Output: single photorealistic fashion photograph
```

### AR Implementation
- Uses native `getUserMedia` for webcam access
- CSS `mix-blend-mode: multiply` for natural overlay blending
- Adjustable scale, position via UI controls

---

## 📋 Permissions Explained

| Permission | Reason |
|------------|--------|
| `activeTab` | Access the current tab's images |
| `storage` | Save your API key locally |
| `contextMenus` | Add right-click "Virtual Try-On" option |
| `scripting` | Inject content script on demand |
| `https://generativelanguage.googleapis.com/*` | Call Google Gemini API |
| `<all_urls>` | Detect clothing images on any shopping site |

---

## 🚧 Known Limitations

1. **Image generation quality** depends on Gemini's current capabilities
2. **CORS restrictions** may prevent some product images from loading (use right-click menu as workaround)
3. **Free API tier** has rate limits (~15 requests/minute)
4. **AR mode** is a basic overlay — not full body-pose-tracked AR
5. **Image output** format varies by Gemini response

---

## 🔄 Version History

- **v1.0.0** — Initial release with AI try-on, webcam, AR overlay

---

## 📄 License

MIT License — Free for personal and commercial use.

---

*Built with ❤️ using Google Gemini AI, Chrome Extension APIs, and MediaPipe*
