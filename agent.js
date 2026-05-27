require("dotenv").config();

const { genkit } = require("genkit");
const { googleAI } = require("@genkit-ai/google-genai");

const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GOOGLE_API_KEY,
    }),
  ],
  model: "googleai/gemini-2.0-flash",
});

async function runAgent() {
  const response = await ai.generate({
    prompt: "Jelaskan konsep AI Supply Chain Ecosystem",
  });

  console.log(response.text);
}

runAgent();