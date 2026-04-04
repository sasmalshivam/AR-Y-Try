import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "MOCK_KEY", "v1beta");

const STYLIST_PROMPT = `
You are an advanced AI stylist and computer vision model.
Analyze the provided image of a person and consider the following custom parameters if provided:
- Height: {height}
- Width/Body Type: {width}
- Purpose/Occasion: {purpose}

Analyze the user's skin tone, undertone, and body shape based on the image and parameters.
Return ONLY a JSON object with the following structure.
Do NOT include any markdown formatting or extra text.

{
  "analysis": {
    "skin_tone": "light/medium/tan/deep",
    "undertone": "warm/cool/neutral",
    "contrast_level": "low/medium/high",
    "body_shape": "detected body shape based on width/height",
    "confidence_score": "0.0 to 1.0"
  },
  "recommended_colors": {
    "primary": ["Color Name (Hex)"],
    "secondary": ["Color Name (Hex)"],
    "accent": ["Color Name (Hex)"]
  },
  "outfit_recommendations": [
    {
      "id": "unique_id",
      "combination": {
        "top": "specific garment type and color",
        "bottom": "specific garment type and color",
        "layer": "optional layer"
      },
      "match_score": 0,
      "occasion": "specific occasion",
      "tag": "best/good/avoid",
      "rationale": "why this works for their body type and skin tone"
    }
  ],
  "avoid_colors": [],
  "face_analysis": {
    "face_shape": "oval/round/square/heart/diamond",
    "hairstyle_recommendations": [],
    "eyewear_recommendations": []
  },
  "seasonal_palettes": {
    "summer": [],
    "winter": [],
    "formal": [],
    "casual": []
  },
  "style_recommendations": [],
  "explanations": {
    "why_colors_work": "",
    "why_to_avoid": ""
  }
}

Rules:
- Base results on color theory, skin undertone, and body proportions (height/width).
- Use modern fashion trends.
- Keep suggestions realistic and wearable.
- Detect facial contrast between skin, hair, and eyes.
`;

export const analyzeImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded." });
    }

    const { height, width, purpose } = req.body;
    const imagePath = req.file.path;
    const imageData = fs.readFileSync(imagePath);
    
    // Fallback if no API key
    if (!process.env.GEMINI_API_KEY) {
      console.warn("No GEMINI_API_KEY found, using mock data.");
      fs.unlinkSync(imagePath);
      return res.json(getMockResult(height, width, purpose));
    }

    const imagePart = {
      inlineData: {
        data: imageData.toString("base64"),
        mimeType: req.file.mimetype,
      },
    };

    const customizedPrompt = STYLIST_PROMPT
      .replace("{height}", height || "Not specified")
      .replace("{width}", width || "Not specified")
      .replace("{purpose}", purpose || "General styling");

    let analysisJson;
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
      const result = await model.generateContent([customizedPrompt, imagePart]);
      const responseText = result.response.text();
      const cleanedJson = responseText.replace(/```json|```/g, "").trim();
      analysisJson = JSON.parse(cleanedJson);
    } catch (aiErr) {
      console.warn("Gemini API initialization/execution error, falling back to mock:", aiErr.message);
      analysisJson = getMockResult(height, width, purpose);
    }

    res.json(analysisJson);

    // Clean up
    fs.unlinkSync(imagePath);
  } catch (err) {
    console.error("AI Analysis Error:", err);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ message: "Error analyzing image", error: err.message });
  }
};

export const auditGarment = async (req, res) => {
  try {
    const { skin_tone, undertone } = req.body;
    if (!req.file) return res.status(400).json({ message: "No garment image." });

    const imagePath = req.file.path;
    
    if (!process.env.GEMINI_API_KEY) {
      fs.unlinkSync(imagePath);
      return res.json({ status: "match", match_score: 88, recommendation: "The warmth of this fabric matches your golden undertones perfectly." });
    }

    const imageData = fs.readFileSync(imagePath);
    const imagePart = {
      inlineData: { data: imageData.toString("base64"), mimeType: req.file.mimetype }
    };

    const prompt = `
      You are an AI Stylist. 
      The user has ${skin_tone} skin with a ${undertone} undertone.
      Analyze the provided garment's color and texture.
      Determine if it "Matches", "Complements", or "Clashes" with the user's complexion.
      Return ONLY a JSON: { "status": "match/clash/good", "match_score": 0-100, "recommendation": "Concise advice." }
    `;

    let data;
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
      const result = await model.generateContent([prompt, imagePart]);
      data = JSON.parse(result.response.text().replace(/```json|```/g, "").trim());
    } catch (aiErr) {
      console.warn("Garment AI error, falling back to mock:", aiErr.message);
      data = { status: "match", match_score: 88, recommendation: "The warmth of this fabric matches your golden undertones perfectly. (Mock Mode)" };
    }
    
    res.json(data);
    fs.unlinkSync(imagePath);
  } catch (err) {
    console.error("Garment Audit Error:", err);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ message: "Garment audit error" });
  }
};

const getMockResult = (height, width, purpose) => ({
  analysis: {
    skin_tone: "Tan (Medium-Deep)",
    undertone: "Warm (Golden/Olive)",
    contrast_level: "High",
    body_shape: "Athletic (based on inputs)",
    confidence_score: "0.98 (Mock)"
  },
  recommended_colors: {
    primary: ["Deep Burgundy (#800020)", "Forest Green (#228B22)", "Mustard Yellow (#FFDB58)", "Rust (#B7410E)"],
    secondary: ["Cream (#FFFDD0)", "Olive (#808000)", "Navy Blue (#000080)", "Camel (#C19A6B)"],
    accent: ["Gold (#FFD700)", "Burnt Sienna (#E97451)", "Teal (#008080)"]
  },
  outfit_recommendations: [
    { id: "outfit_1", combination: { top: "Cream Linen Shirt", bottom: "Tan Chinos", layer: "None" }, match_score: 95, occasion: purpose || "Casual", tag: "best", rationale: "Light colors contrast beautifully with tan skin." },
    { id: "outfit_2", combination: { top: "Navy Blue Polo", bottom: "Olive Green Trousers", layer: "Beige Harrington Jacket" }, match_score: 92, occasion: "Smart Casual", tag: "best", rationale: "Structured jacket complements your frame." }
  ],
  avoid_colors: ["Icy Lilac", "Cool Mint", "Electric Pink", "Baby Blue"],
  face_analysis: {
    face_shape: "Oval",
    hairstyle_recommendations: ["Textured Quiff", "Classic Side Part"],
    eyewear_recommendations: ["Wayfarers", "Rectangular Frames"]
  },
  seasonal_palettes: { summer: ["Sand", "Sage"], winter: ["Emerald", "Wine"], formal: ["Charcoal"], casual: ["Rust"] },
  style_recommendations: ["Old Money Minimal", "Rugged Utility"],
  explanations: {
    why_colors_work: "Your warm golden undertones harmonize perfectly with earthy and jewel tones.",
    why_to_avoid: "Cool-toned pastels create a clashing effect with your warm complexion."
  }
});
