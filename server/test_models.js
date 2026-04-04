import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  try {
    const listModelsResponse = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" }).listModels();
    console.log(listModelsResponse);
  } catch (error) {
    console.error("Error listing models:", error);
    // Usually we can't list models with the client SDK easily, but let's see if there's a workaround.
  }
}

// Better way: try a few likely model names
async function findWorkingModel() {
  const models = [
    "gemini-1.5-flash", 
    "gemini-1.5-flash-latest", 
    "gemini-2.0-flash", 
    "gemini-2.1-flash", 
    "gemini-3.1-pro", 
    "gemini-3.1-flash-lite"
  ];
  for (const m of models) {
    try {
      const model = genAI.getGenerativeModel({ model: m });
      const result = await model.generateContent("test");
      if (result.response) {
        console.log(`Model ${m} is working!`);
        return m;
      }
    } catch (e) {
      console.log(`Model ${m} failed:`, e.message);
    }
  }
}

findWorkingModel();
