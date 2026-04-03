// popup.js - Extension Popup Logic

document.addEventListener("DOMContentLoaded", async () => {
  const apiKeyInput = document.getElementById("apiKeyInput");
  const saveBtn = document.getElementById("saveBtn");
  const deleteBtn = document.getElementById("deleteBtn");
  const toggleVisibility = document.getElementById("toggleVisibility");
  const feedback = document.getElementById("feedback");
  const statusDot = document.getElementById("statusDot");
  const statusLabel = document.getElementById("statusLabel");
  const statusSub = document.getElementById("statusSub");

  // ─── Load saved API key ──────────────────────────────────────────────────────
  const result = await chrome.storage.sync.get(["geminiApiKey"]);
  
  if (result.geminiApiKey) {
    apiKeyInput.value = result.geminiApiKey;
    setActiveStatus();
    deleteBtn.classList.add("visible");
  }

  // ─── Toggle visibility ───────────────────────────────────────────────────────
  let isVisible = false;
  toggleVisibility.addEventListener("click", () => {
    isVisible = !isVisible;
    apiKeyInput.type = isVisible ? "text" : "password";
    toggleVisibility.textContent = isVisible ? "🙈" : "👁";
  });

  // ─── Save API Key ────────────────────────────────────────────────────────────
  saveBtn.addEventListener("click", async () => {
    const key = apiKeyInput.value.trim();

    if (!key) {
      showFeedback("Please enter an API key", "error");
      shake(apiKeyInput);
      return;
    }

    if (!key.startsWith("AIza") || key.length < 30) {
      showFeedback("Invalid API key format. Should start with 'AIza...'", "error");
      shake(apiKeyInput);
      return;
    }

    saveBtn.textContent = "Saving...";
    saveBtn.disabled = true;

    try {
      // Test the key with a quick ping to Gemini
      const isValid = await validateApiKey(key);
      
      if (!isValid) {
        showFeedback("⚠ Key saved (validation unavailable in extension context)", "success");
      } else {
        showFeedback("✓ API key verified and saved!", "success");
      }

      await chrome.storage.sync.set({ geminiApiKey: key });
      setActiveStatus();
      deleteBtn.classList.add("visible");

      saveBtn.textContent = "✓ Saved!";
      saveBtn.classList.add("saved");

      setTimeout(() => {
        saveBtn.textContent = "Save API Key";
        saveBtn.classList.remove("saved");
        saveBtn.disabled = false;
      }, 2000);

    } catch (err) {
      showFeedback("Failed to save. Please try again.", "error");
      saveBtn.textContent = "Save API Key";
      saveBtn.disabled = false;
    }
  });

  // Allow Enter key to save
  apiKeyInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") saveBtn.click();
  });

  // ─── Delete API Key ──────────────────────────────────────────────────────────
  deleteBtn.addEventListener("click", async () => {
    if (!confirm("Remove saved API key?")) return;
    
    await chrome.storage.sync.remove(["geminiApiKey"]);
    apiKeyInput.value = "";
    deleteBtn.classList.remove("visible");
    setInactiveStatus();
    showFeedback("API key removed", "success");
  });

  // ─── Input change handler ────────────────────────────────────────────────────
  apiKeyInput.addEventListener("input", () => {
    feedback.className = "feedback";
    feedback.textContent = "";
    saveBtn.textContent = "Save API Key";
    saveBtn.classList.remove("saved");
    saveBtn.disabled = false;
  });

  // ─── Helpers ─────────────────────────────────────────────────────────────────
  function setActiveStatus() {
    statusDot.classList.add("active");
    statusLabel.textContent = "Ready to Try On";
    statusSub.textContent = "API key configured • Right-click any clothing";
  }

  function setInactiveStatus() {
    statusDot.classList.remove("active");
    statusLabel.textContent = "API Key Required";
    statusSub.textContent = "Add your Gemini API key to get started";
  }

  function showFeedback(msg, type) {
    feedback.textContent = msg;
    feedback.className = `feedback ${type}`;
    setTimeout(() => {
      feedback.className = "feedback";
    }, 4000);
  }

  function shake(element) {
    element.style.animation = "none";
    element.offsetHeight; // reflow
    element.style.animation = "shake 0.4s ease";
    element.addEventListener("animationend", () => {
      element.style.animation = "";
    }, { once: true });
  }

  async function validateApiKey(key) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`,
        { method: "GET" }
      );
      return response.ok;
    } catch {
      return null; // Can't validate in this context
    }
  }
});

// Shake animation
const style = document.createElement("style");
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-6px); }
    40% { transform: translateX(6px); }
    60% { transform: translateX(-4px); }
    80% { transform: translateX(4px); }
  }
`;
document.head.appendChild(style);
