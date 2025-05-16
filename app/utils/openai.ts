import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_KEY } from "./constants";

if (!GEMINI_KEY) {
  throw new Error("GEMINI_KEY is not defined");
}
const genAI = new GoogleGenerativeAI(GEMINI_KEY);
const openai = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export default openai;
