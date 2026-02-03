import { GoogleGenerativeAI } from "@google/generative-ai";
import pdfParse from "pdf-parse";
import Tesseract from "tesseract.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// We'll use the default but sometimes v1 is more stable for fixed models
const modelName = "gemini-2.5-flash"; 

export const summarizeDocument = async (buffer, mimeType) => {
    try {
        let text = "";
        if (mimeType === "application/pdf") {
            const data = await pdfParse(buffer);
            text = data.text;
        } else if (mimeType.startsWith("text/")) {
            text = buffer.toString();
        } else if (mimeType.startsWith("image/")) {
            const { data: { text: ocrText } } = await Tesseract.recognize(buffer, 'eng');
            text = ocrText;
        }

        if (!text) return "Could not extract text from document.";

        const model = genAI.getGenerativeModel({ model: modelName });
        const prompt = `Summarize the following document text in one concise paragraph: \n\n${text.substring(0, 10000)}`;
        const result = await model.generateContent([prompt]);
        return result.response.text();
    } catch (error) {
        console.error("AI Summarize Error:", error);
        return "Failed to generate summary.";
    }
};

export const chatWithDocument = async (buffer, mimeType, question) => {
    try {
        let text = "";
        if (mimeType === "application/pdf") {
            const data = await pdfParse(buffer);
            text = data.text;
        } else if (mimeType.startsWith("text/")) {
            text = buffer.toString();
        } else if (mimeType.startsWith("image/")) {
            const { data: { text: ocrText } } = await Tesseract.recognize(buffer, 'eng');
            text = ocrText;
        }

        const model = genAI.getGenerativeModel({ model: modelName });
        const prompt = `Context: ${text.substring(0, 20000)}\n\nQuestion: ${question}`;
        const result = await model.generateContent([prompt]);
        return result.response.text();
    } catch (error) {
        console.error("AI Chat Error:", error);
        return "Failed to get answer.";
    }
};

export const autoTagDocument = async (filename, buffer, mimeType) => {
    try {
        let text = "";
        if (mimeType === "application/pdf") {
            const data = await pdfParse(buffer);
            text = data.text;
        } else if (mimeType.startsWith("image/")) {
            const { data: { text: ocrText } } = await Tesseract.recognize(buffer, 'eng');
            text = ocrText;
        }

        const model = genAI.getGenerativeModel({ model: modelName });
        const prompt = `Analyze the document named "${filename}" and its content snippet: "${text.substring(0, 3000)}". Generate 3-5 relevant tags (e.g., Invoice, Legal, Identity, Work, Receipt). Return ONLY the tags separated by commas.`;
        const result = await model.generateContent([prompt]);
        return result.response.text().split(",").map(t => t.trim());
    } catch (error) {
        console.error("AI Auto-Tag Error:", error);
        return ["Document"];
    }
};

export const performOCR = async (buffer) => {
    try {
        const { data: { text } } = await Tesseract.recognize(buffer, 'eng');
        return text;
    } catch (error) {
        console.error("OCR Error:", error);
        return "";
    }
};
