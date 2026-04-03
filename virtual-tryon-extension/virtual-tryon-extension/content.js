// content.js - Injected into all web pages

(function () {
  "use strict";

  // Prevent double injection
  if (window.__virtualTryOnInjected) return;
  window.__virtualTryOnInjected = true;

  // ─── State ──────────────────────────────────────────────────────────────────
  let state = {
    selectedClothingUrl: null,
    selectedClothingEl: null,
    floatingBtn: null,
    modal: null,
    isModalOpen: false,
    userImageBase64: null,
    userImageMimeType: "image/jpeg",
    clothingImageBase64: null,
    clothingImageMimeType: "image/jpeg",
    resultImageBase64: null,
    resultMimeType: null,
    webcamStream: null,
    currentMode: "ai", // 'ai' or 'ar'
    arModule: null,
    compareMode: false,
  };

  // ─── Listen for messages from background ────────────────────────────────────
  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "openTryOnModal") {
      state.selectedClothingUrl = message.clothingImageUrl;
      state.currentMode = message.mode || "ai";
      openModal(state.selectedClothingUrl);
    }
  });

  // ─── Clothing Detection & Hover ─────────────────────────────────────────────
  function isLikelyClothing(img) {
    const src = (img.src || "").toLowerCase();
    const alt = (img.alt || "").toLowerCase();
    const cls = (img.className || "").toLowerCase();
    const closestLink = img.closest("a")?.href || "";

    const clothingKeywords = [
      "shirt", "tshirt", "dress", "pants", "jeans", "jacket", "coat",
      "sweater", "hoodie", "blouse", "skirt", "shorts", "top", "bottom",
      "suit", "blazer", "kurta", "saree", "lehenga", "apparel", "clothing",
      "fashion", "wear", "outfit", "garment", "fabric",
    ];

    const combined = `${src} ${alt} ${cls} ${closestLink}`;
    return clothingKeywords.some((kw) => combined.includes(kw));
  }

  function addHoverButtons() {
    const images = document.querySelectorAll("img");
    images.forEach((img) => {
      if (img.dataset.tryonAttached) return;
      if (img.width < 80 || img.height < 80) return;

      img.dataset.tryonAttached = "true";
      img.style.cursor = "pointer";

      img.addEventListener("mouseenter", () => showFloatingBtn(img));
      img.addEventListener("mouseleave", (e) => {
        if (!e.relatedTarget || !e.relatedTarget.closest?.(".vto-float-btn")) {
          hideFloatingBtn();
        }
      });
    });
  }

  function showFloatingBtn(img) {
    if (!state.floatingBtn) createFloatingBtn();

    const rect = img.getBoundingClientRect();
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    state.floatingBtn.style.top = `${rect.top + scrollY + 8}px`;
    state.floatingBtn.style.left = `${rect.left + scrollX + rect.width - 110}px`;
    state.floatingBtn.style.display = "flex";
    state.floatingBtn.dataset.imgSrc = img.src;

    state.floatingBtn.onmouseenter = () => clearTimeout(state._hideTimer);
    state.floatingBtn.onmouseleave = hideFloatingBtn;
  }

  function hideFloatingBtn() {
    state._hideTimer = setTimeout(() => {
      if (state.floatingBtn) state.floatingBtn.style.display = "none";
    }, 200);
  }

  function createFloatingBtn() {
    const btn = document.createElement("div");
    btn.className = "vto-float-btn";
    btn.innerHTML = `
      <span class="vto-float-icon">👗</span>
      <span class="vto-float-text">Try On</span>
    `;
    btn.addEventListener("click", () => {
      const src = btn.dataset.imgSrc;
      if (src) {
        state.selectedClothingUrl = src;
        state.currentMode = "ai";
        openModal(src);
        hideFloatingBtn();
      }
    });
    document.body.appendChild(btn);
    state.floatingBtn = btn;
  }

  // ─── Modal Creation ──────────────────────────────────────────────────────────
  function openModal(clothingUrl) {
    if (state.isModalOpen) closeModal();
    state.isModalOpen = true;
    state.resultImageBase64 = null;
    state.userImageBase64 = null;
    state.compareMode = false;

    const overlay = document.createElement("div");
    overlay.id = "vto-overlay";
    overlay.innerHTML = buildModalHTML(clothingUrl);
    document.body.appendChild(overlay);
    state.modal = overlay;

    // Preload clothing image
    loadClothingImage(clothingUrl);

    // Setup listeners
    setupModalListeners(overlay);

    // Animate in
    requestAnimationFrame(() => {
      overlay.classList.add("vto-visible");
    });
  }

  function buildModalHTML(clothingUrl) {
    return `
      <div class="vto-backdrop" id="vto-backdrop"></div>
      <div class="vto-modal" id="vto-modal">
        
        <!-- Header -->
        <div class="vto-header">
          <div class="vto-header-left">
            <div class="vto-logo">
              <span class="vto-logo-icon">✦</span>
              <span class="vto-logo-text">Virtual Try-On</span>
            </div>
            <div class="vto-badge">AI Powered</div>
          </div>
          <button class="vto-close" id="vto-close">✕</button>
        </div>

        <!-- Progress Steps -->
        <div class="vto-steps">
          <div class="vto-step active" data-step="1">
            <div class="vto-step-num">1</div>
            <div class="vto-step-label">Your Photo</div>
          </div>
          <div class="vto-step-line"></div>
          <div class="vto-step" data-step="2">
            <div class="vto-step-num">2</div>
            <div class="vto-step-label">Clothing</div>
          </div>
          <div class="vto-step-line"></div>
          <div class="vto-step" data-step="3">
            <div class="vto-step-num">3</div>
            <div class="vto-step-label">Generate</div>
          </div>
          <div class="vto-step-line"></div>
          <div class="vto-step" data-step="4">
            <div class="vto-step-num">4</div>
            <div class="vto-step-label">Result</div>
          </div>
        </div>

        <!-- Body -->
        <div class="vto-body">

          <!-- LEFT: User Image Panel -->
          <div class="vto-panel" id="vto-panel-user">
            <div class="vto-panel-title">
              <span class="vto-panel-icon">🧑</span>
              Your Photo
            </div>
            
            <div class="vto-image-zone" id="vto-user-zone">
              <div class="vto-zone-placeholder" id="vto-user-placeholder">
                <div class="vto-zone-icon">📷</div>
                <div class="vto-zone-text">Upload your photo or use webcam</div>
              </div>
              <img class="vto-preview-img" id="vto-user-preview" style="display:none;" />
              <video class="vto-webcam-video" id="vto-webcam-video" autoplay muted style="display:none;"></video>
              <canvas id="vto-webcam-canvas" style="display:none;"></canvas>
            </div>

            <div class="vto-btn-group">
              <label class="vto-btn vto-btn-secondary" for="vto-upload-input">
                <span>📁</span> Upload
              </label>
              <input type="file" id="vto-upload-input" accept="image/*" style="display:none;">
              <button class="vto-btn vto-btn-secondary" id="vto-webcam-btn">
                <span>📷</span> Webcam
              </button>
            </div>
            <div class="vto-webcam-controls" id="vto-webcam-controls" style="display:none;">
              <button class="vto-btn vto-btn-accent" id="vto-capture-btn">📸 Capture</button>
              <button class="vto-btn vto-btn-ghost" id="vto-stop-webcam-btn">✕ Close</button>
            </div>
          </div>

          <!-- CENTER: Arrow + Generate -->
          <div class="vto-center-col">
            <div class="vto-center-arrow">→</div>
            <button class="vto-btn vto-btn-generate" id="vto-generate-btn" disabled>
              <span class="vto-btn-inner">
                <span class="vto-gen-icon">✦</span>
                <span class="vto-gen-text">Generate Try-On</span>
              </span>
              <div class="vto-btn-shimmer"></div>
            </button>
            <div class="vto-mode-toggle">
              <button class="vto-mode-btn active" id="vto-mode-ai" data-mode="ai">🤖 AI Mode</button>
              <button class="vto-mode-btn" id="vto-mode-ar" data-mode="ar">📷 AR Mode</button>
            </div>
            <div class="vto-hint" id="vto-hint">Add your photo to continue</div>
          </div>

          <!-- RIGHT: Clothing + Result Panel -->
          <div class="vto-panel" id="vto-panel-clothing">
            <div class="vto-panel-title">
              <span class="vto-panel-icon">👗</span>
              <span id="vto-panel-right-title">Selected Clothing</span>
            </div>

            <!-- Clothing Preview -->
            <div class="vto-image-zone" id="vto-clothing-zone">
              <div class="vto-zone-placeholder" id="vto-clothing-placeholder">
                <div class="vto-zone-icon">⏳</div>
                <div class="vto-zone-text">Loading clothing...</div>
              </div>
              <img class="vto-preview-img" id="vto-clothing-preview" style="display:none;" />
            </div>

            <!-- Result (hidden initially) -->
            <div class="vto-result-zone" id="vto-result-zone" style="display:none;">
              <div class="vto-compare-toggle" id="vto-compare-toggle" style="display:none;">
                <button class="vto-compare-btn active" id="vto-show-result">Result</button>
                <button class="vto-compare-btn" id="vto-show-original">Original</button>
              </div>
              <div class="vto-result-img-wrap">
                <img class="vto-result-img" id="vto-result-img" />
                <div class="vto-result-badge">AI Generated ✦</div>
              </div>
              <div class="vto-result-actions">
                <button class="vto-btn vto-btn-accent" id="vto-download-btn">
                  ⬇ Download
                </button>
                <button class="vto-btn vto-btn-secondary" id="vto-retry-btn">
                  🔄 Retry
                </button>
              </div>
            </div>

            <!-- AR Module Zone -->
            <div class="vto-ar-zone" id="vto-ar-zone" style="display:none;">
              <video id="vto-ar-video" autoplay muted playsinline></video>
              <canvas id="vto-ar-canvas"></canvas>
              <div class="vto-ar-overlay-clothing" id="vto-ar-clothing-overlay"></div>
              <div class="vto-ar-controls">
                <button class="vto-ar-ctrl" id="vto-ar-bigger">+</button>
                <button class="vto-ar-ctrl" id="vto-ar-smaller">−</button>
                <button class="vto-ar-ctrl" id="vto-ar-up">↑</button>
                <button class="vto-ar-ctrl" id="vto-ar-down">↓</button>
                <button class="vto-ar-ctrl vto-ar-stop" id="vto-ar-stop">■</button>
              </div>
            </div>
          </div>

        </div>

        <!-- Loading Overlay -->
        <div class="vto-loading" id="vto-loading" style="display:none;">
          <div class="vto-loading-inner">
            <div class="vto-spinner-ring"></div>
            <div class="vto-loading-title">Generating Try-On</div>
            <div class="vto-loading-steps" id="vto-loading-steps">
              <div class="vto-ls active">🔍 Analyzing clothing...</div>
              <div class="vto-ls">👤 Detecting body...</div>
              <div class="vto-ls">✨ Applying AI magic...</div>
              <div class="vto-ls">🎨 Rendering result...</div>
            </div>
            <button class="vto-btn vto-btn-ghost vto-cancel-btn" id="vto-cancel-btn">Cancel</button>
          </div>
        </div>

        <!-- Error Toast -->
        <div class="vto-toast" id="vto-toast" style="display:none;"></div>

        <!-- API Key Missing -->
        <div class="vto-apikey-notice" id="vto-apikey-notice" style="display:none;">
          <div class="vto-apikey-icon">🔑</div>
          <div class="vto-apikey-text">
            <strong>Gemini API Key Required</strong>
            <p>Click the extension icon to add your free API key</p>
          </div>
          <button class="vto-btn vto-btn-accent vto-apikey-btn" id="vto-open-popup-btn">Set API Key</button>
        </div>

      </div>
    `;
  }

  // ─── Modal Event Listeners ───────────────────────────────────────────────────
  function setupModalListeners(overlay) {
    const $ = (id) => document.getElementById(id);

    // Close
    $("vto-close").addEventListener("click", closeModal);
    $("vto-backdrop").addEventListener("click", closeModal);
    document.addEventListener("keydown", handleKeyClose);

    // Upload
    $("vto-upload-input").addEventListener("change", handleFileUpload);

    // Webcam
    $("vto-webcam-btn").addEventListener("click", startWebcam);
    $("vto-capture-btn").addEventListener("click", captureWebcam);
    $("vto-stop-webcam-btn").addEventListener("click", stopWebcam);

    // Generate
    $("vto-generate-btn").addEventListener("click", handleGenerate);

    // Mode toggle
    $("vto-mode-ai").addEventListener("click", () => setMode("ai"));
    $("vto-mode-ar").addEventListener("click", () => setMode("ar"));

    // Result actions
    $("vto-download-btn").addEventListener("click", downloadResult);
    $("vto-retry-btn").addEventListener("click", handleRetry);
    $("vto-cancel-btn").addEventListener("click", cancelGeneration);

    // Compare
    $("vto-show-result").addEventListener("click", () => toggleCompare(false));
    $("vto-show-original").addEventListener("click", () => toggleCompare(true));

    // AR Controls
    $("vto-ar-stop").addEventListener("click", stopARMode);
    $("vto-ar-bigger").addEventListener("click", () => adjustARClothing("scale", 1.1));
    $("vto-ar-smaller").addEventListener("click", () => adjustARClothing("scale", 0.9));
    $("vto-ar-up").addEventListener("click", () => adjustARClothing("y", -10));
    $("vto-ar-down").addEventListener("click", () => adjustARClothing("y", 10));

    // Open popup for API key
    const popupBtn = $("vto-open-popup-btn");
    if (popupBtn) {
      popupBtn.addEventListener("click", () => {
        chrome.runtime.sendMessage({ action: "openPopupForKey" });
      });
    }

    // Drag and drop on user zone
    const userZone = $("vto-user-zone");
    userZone.addEventListener("dragover", (e) => { e.preventDefault(); userZone.classList.add("drag-over"); });
    userZone.addEventListener("dragleave", () => userZone.classList.remove("drag-over"));
    userZone.addEventListener("drop", (e) => {
      e.preventDefault();
      userZone.classList.remove("drag-over");
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) processUserImageFile(file);
    });
  }

  function handleKeyClose(e) {
    if (e.key === "Escape") closeModal();
  }

  function closeModal() {
    stopWebcam();
    if (state.modal) {
      state.modal.classList.remove("vto-visible");
      setTimeout(() => {
        if (state.modal) {
          state.modal.remove();
          state.modal = null;
        }
      }, 300);
    }
    document.removeEventListener("keydown", handleKeyClose);
    state.isModalOpen = false;
    state.resultImageBase64 = null;
    state.userImageBase64 = null;
  }

  // ─── Clothing Image Loading ──────────────────────────────────────────────────
  async function loadClothingImage(url) {
    const placeholder = document.getElementById("vto-clothing-placeholder");
    const preview = document.getElementById("vto-clothing-preview");

    try {
      const base64Data = await fetchImageAsBase64(url);
      state.clothingImageBase64 = base64Data.base64;
      state.clothingImageMimeType = base64Data.mimeType;

      preview.src = `data:${base64Data.mimeType};base64,${base64Data.base64}`;
      preview.style.display = "block";
      if (placeholder) placeholder.style.display = "none";

      updateGenerateButton();
      stepComplete(2);
    } catch (err) {
      if (placeholder) {
        placeholder.querySelector(".vto-zone-icon").textContent = "⚠️";
        placeholder.querySelector(".vto-zone-text").textContent = "Could not load image. Try right-clicking another.";
      }
      showToast("Could not load the clothing image. Try another one.", "error");
    }
  }

  async function fetchImageAsBase64(url) {
    // Use a canvas to convert image to base64 (handles CORS for same-origin)
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
          const base64 = dataUrl.split(",")[1];
          resolve({ base64, mimeType: "image/jpeg" });
        } catch (e) {
          // If canvas tainted, try fetch
          fetchViaBackground(url).then(resolve).catch(reject);
        }
      };
      img.onerror = () => fetchViaBackground(url).then(resolve).catch(reject);
      img.src = url;
    });
  }

  async function fetchViaBackground(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch image");
    const blob = await response.blob();
    const mimeType = blob.type || "image/jpeg";
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result.split(",")[1];
        resolve({ base64, mimeType });
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  // ─── User Image Handling ─────────────────────────────────────────────────────
  function handleFileUpload(e) {
    const file = e.target.files[0];
    if (file) processUserImageFile(file);
  }

  function processUserImageFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      const mimeType = file.type || "image/jpeg";
      const base64 = dataUrl.split(",")[1];

      state.userImageBase64 = base64;
      state.userImageMimeType = mimeType;

      const preview = document.getElementById("vto-user-preview");
      const placeholder = document.getElementById("vto-user-placeholder");
      const video = document.getElementById("vto-webcam-video");

      preview.src = dataUrl;
      preview.style.display = "block";
      if (placeholder) placeholder.style.display = "none";
      video.style.display = "none";

      stopWebcam(false);
      updateGenerateButton();
      stepComplete(1);
    };
    reader.readAsDataURL(file);
  }

  // ─── Webcam ──────────────────────────────────────────────────────────────────
  async function startWebcam() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: 640, height: 480 } });
      state.webcamStream = stream;

      const video = document.getElementById("vto-webcam-video");
      const preview = document.getElementById("vto-user-preview");
      const placeholder = document.getElementById("vto-user-placeholder");
      const controls = document.getElementById("vto-webcam-controls");

      preview.style.display = "none";
      if (placeholder) placeholder.style.display = "none";
      video.srcObject = stream;
      video.style.display = "block";
      if (controls) controls.style.display = "flex";
    } catch (err) {
      showToast("Camera access denied. Please allow camera permissions.", "error");
    }
  }

  function captureWebcam() {
    const video = document.getElementById("vto-webcam-video");
    const canvas = document.getElementById("vto-webcam-canvas");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    const base64 = dataUrl.split(",")[1];

    state.userImageBase64 = base64;
    state.userImageMimeType = "image/jpeg";

    const preview = document.getElementById("vto-user-preview");
    const controls = document.getElementById("vto-webcam-controls");

    preview.src = dataUrl;
    preview.style.display = "block";
    video.style.display = "none";
    if (controls) controls.style.display = "none";

    stopWebcam(false);
    updateGenerateButton();
    stepComplete(1);
    showToast("Photo captured! ✓", "success");
  }

  function stopWebcam(resetPreview = true) {
    if (state.webcamStream) {
      state.webcamStream.getTracks().forEach((t) => t.stop());
      state.webcamStream = null;
    }
    const video = document.getElementById("vto-webcam-video");
    const controls = document.getElementById("vto-webcam-controls");
    if (video) video.style.display = "none";
    if (controls) controls.style.display = "none";

    if (resetPreview && !state.userImageBase64) {
      const placeholder = document.getElementById("vto-user-placeholder");
      if (placeholder) placeholder.style.display = "flex";
    }
  }

  // ─── Mode Toggle ─────────────────────────────────────────────────────────────
  function setMode(mode) {
    state.currentMode = mode;

    document.querySelectorAll(".vto-mode-btn").forEach((b) => b.classList.remove("active"));
    document.getElementById(`vto-mode-${mode}`)?.classList.add("active");

    if (mode === "ar") {
      document.getElementById("vto-generate-btn").querySelector(".vto-gen-text").textContent = "Start AR Try-On";
    } else {
      document.getElementById("vto-generate-btn").querySelector(".vto-gen-text").textContent = "Generate Try-On";
    }
  }

  // ─── Generate Button State ───────────────────────────────────────────────────
  function updateGenerateButton() {
    const btn = document.getElementById("vto-generate-btn");
    const hint = document.getElementById("vto-hint");
    if (!btn) return;

    if (state.userImageBase64 && state.clothingImageBase64) {
      btn.disabled = false;
      if (hint) hint.textContent = "Ready to generate!";
      stepComplete(3);
    } else if (!state.userImageBase64) {
      btn.disabled = true;
      if (hint) hint.textContent = "Add your photo to continue";
    } else if (!state.clothingImageBase64) {
      btn.disabled = true;
      if (hint) hint.textContent = "Loading clothing image...";
    }
  }

  function stepComplete(stepNum) {
    const steps = document.querySelectorAll(".vto-step");
    steps.forEach((s) => {
      const n = parseInt(s.dataset.step);
      if (n < stepNum) s.classList.add("done");
      if (n === stepNum) s.classList.add("active");
    });
  }

  // ─── Generation ──────────────────────────────────────────────────────────────
  let generationAborted = false;

  async function handleGenerate() {
    if (state.currentMode === "ar") {
      startARMode();
      return;
    }

    // Check API key first
    const keyResponse = await chrome.runtime.sendMessage({ action: "getApiKey" });
    if (!keyResponse?.apiKey) {
      document.getElementById("vto-apikey-notice").style.display = "flex";
      return;
    }

    showLoading(true);
    generationAborted = false;
    stepComplete(3);

    // Animate loading steps
    animateLoadingSteps();

    try {
      const result = await chrome.runtime.sendMessage({
        action: "generateTryOn",
        data: {
          userImageBase64: state.userImageBase64,
          clothingImageBase64: state.clothingImageBase64,
          userMimeType: state.userImageMimeType,
          clothingMimeType: state.clothingImageMimeType,
        },
      });

      if (generationAborted) return;

      if (!result.success) {
        handleGenerationError(result.error);
        return;
      }

      showResult(result.data);
      stepComplete(4);
    } catch (err) {
      if (!generationAborted) handleGenerationError(err.message);
    } finally {
      showLoading(false);
    }
  }

  function handleGenerationError(errorMsg) {
    showLoading(false);
    if (errorMsg === "NO_API_KEY") {
      document.getElementById("vto-apikey-notice").style.display = "flex";
    } else {
      showToast(`Error: ${errorMsg}`, "error", 6000);
    }
  }

  function cancelGeneration() {
    generationAborted = true;
    showLoading(false);
  }

  let loadingStepTimer = null;

  function animateLoadingSteps() {
    const steps = document.querySelectorAll(".vto-ls");
    let idx = 0;
    steps.forEach((s) => s.classList.remove("active"));
    if (steps[0]) steps[0].classList.add("active");

    loadingStepTimer = setInterval(() => {
      steps[idx]?.classList.remove("active");
      idx = (idx + 1) % steps.length;
      steps[idx]?.classList.add("active");
    }, 2500);
  }

  function showLoading(show) {
    const loader = document.getElementById("vto-loading");
    if (loader) loader.style.display = show ? "flex" : "none";
    if (!show && loadingStepTimer) {
      clearInterval(loadingStepTimer);
      loadingStepTimer = null;
    }
  }

  // ─── Result Display ──────────────────────────────────────────────────────────
  function showResult(data) {
    state.resultImageBase64 = data.base64;
    state.resultMimeType = data.mimeType;

    const resultZone = document.getElementById("vto-result-zone");
    const clothingZone = document.getElementById("vto-clothing-zone");
    const resultImg = document.getElementById("vto-result-img");
    const compareToggle = document.getElementById("vto-compare-toggle");
    const rightTitle = document.getElementById("vto-panel-right-title");

    resultImg.src = `data:${data.mimeType};base64,${data.base64}`;
    
    clothingZone.style.display = "none";
    resultZone.style.display = "block";
    if (compareToggle) compareToggle.style.display = "flex";
    if (rightTitle) rightTitle.textContent = "Try-On Result";

    showToast("✦ Try-On generated successfully!", "success");
  }

  function toggleCompare(showOriginal) {
    const resultImg = document.getElementById("vto-result-img");
    const showResultBtn = document.getElementById("vto-show-result");
    const showOriginalBtn = document.getElementById("vto-show-original");

    if (showOriginal) {
      resultImg.src = `data:${state.userImageMimeType};base64,${state.userImageBase64}`;
      showResultBtn.classList.remove("active");
      showOriginalBtn.classList.add("active");
    } else {
      resultImg.src = `data:${state.resultMimeType};base64,${state.resultImageBase64}`;
      showResultBtn.classList.add("active");
      showOriginalBtn.classList.remove("active");
    }
  }

  function downloadResult() {
    if (!state.resultImageBase64) return;
    const ext = state.resultMimeType?.includes("png") ? "png" : "jpg";
    const a = document.createElement("a");
    a.href = `data:${state.resultMimeType};base64,${state.resultImageBase64}`;
    a.download = `virtual-tryon-${Date.now()}.${ext}`;
    a.click();
  }

  function handleRetry() {
    state.resultImageBase64 = null;
    const resultZone = document.getElementById("vto-result-zone");
    const clothingZone = document.getElementById("vto-clothing-zone");
    const rightTitle = document.getElementById("vto-panel-right-title");

    resultZone.style.display = "none";
    clothingZone.style.display = "block";
    if (rightTitle) rightTitle.textContent = "Selected Clothing";

    handleGenerate();
  }

  // ─── AR Mode ─────────────────────────────────────────────────────────────────
  const arState = { scale: 0.8, x: 0, y: 0, stream: null };

  async function startARMode() {
    if (!state.clothingImageBase64) {
      showToast("No clothing image loaded.", "error");
      return;
    }

    const arZone = document.getElementById("vto-ar-zone");
    const clothingZone = document.getElementById("vto-clothing-zone");
    const arVideo = document.getElementById("vto-ar-video");
    const overlay = document.getElementById("vto-ar-clothing-overlay");
    const rightTitle = document.getElementById("vto-panel-right-title");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
      });
      arState.stream = stream;
      arVideo.srcObject = stream;

      clothingZone.style.display = "none";
      arZone.style.display = "block";
      if (rightTitle) rightTitle.textContent = "Live AR Try-On";

      overlay.style.backgroundImage = `url(data:${state.clothingImageMimeType};base64,${state.clothingImageBase64})`;
      updateAROverlay();

      showToast("📷 AR mode active. Adjust position with controls.", "success");
    } catch (err) {
      showToast("Camera access required for AR mode.", "error");
    }
  }

  function updateAROverlay() {
    const overlay = document.getElementById("vto-ar-clothing-overlay");
    if (!overlay) return;
    const w = Math.round(200 * arState.scale);
    const h = Math.round(260 * arState.scale);
    overlay.style.width = `${w}px`;
    overlay.style.height = `${h}px`;
    overlay.style.left = `calc(50% + ${arState.x}px - ${w / 2}px)`;
    overlay.style.top = `calc(30% + ${arState.y}px)`;
  }

  function adjustARClothing(prop, val) {
    if (prop === "scale") arState.scale = Math.min(2, Math.max(0.3, arState.scale * val));
    if (prop === "y") arState.y += val;
    if (prop === "x") arState.x += val;
    updateAROverlay();
  }

  function stopARMode() {
    if (arState.stream) {
      arState.stream.getTracks().forEach((t) => t.stop());
      arState.stream = null;
    }
    const arZone = document.getElementById("vto-ar-zone");
    const clothingZone = document.getElementById("vto-clothing-zone");
    const rightTitle = document.getElementById("vto-panel-right-title");
    if (arZone) arZone.style.display = "none";
    if (clothingZone) clothingZone.style.display = "block";
    if (rightTitle) rightTitle.textContent = "Selected Clothing";
  }

  // ─── Toast Notifications ─────────────────────────────────────────────────────
  let toastTimer = null;
  function showToast(msg, type = "info", duration = 3000) {
    const toast = document.getElementById("vto-toast");
    if (!toast) return;
    toast.textContent = msg;
    toast.className = `vto-toast vto-toast-${type} vto-toast-show`;
    toast.style.display = "block";
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove("vto-toast-show");
      setTimeout(() => { toast.style.display = "none"; }, 300);
    }, duration);
  }

  // ─── Observe DOM for new images ──────────────────────────────────────────────
  const observer = new MutationObserver(() => {
    addHoverButtons();
  });

  // ─── Init ─────────────────────────────────────────────────────────────────────
  function init() {
    addHoverButtons();
    observer.observe(document.body, { childList: true, subtree: true });
    console.log("[VirtualTryOn] Content script initialized.");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
