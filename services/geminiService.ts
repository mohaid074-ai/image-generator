import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";
import type { EditMode } from '../types';
import { fileToGenerativePart } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const enhancePrompt = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Enhance the following image generation prompt with vivid details, cinematic lighting, and a specific art style. Keep it concise and focused on visual elements. Original prompt: "${prompt}"`,
        config: {
            temperature: 0.8,
            maxOutputTokens: 100,
            // Fix: Added thinkingConfig as required by the guidelines when maxOutputTokens is set for gemini-2.5-flash.
            thinkingConfig: { thinkingBudget: 50 },
        }
    });
    return response.text.trim();
  } catch (error) {
    console.error('Error enhancing prompt:', error);
    throw new Error('Failed to connect with the AI to enhance the prompt. Please try again.');
  }
};

export const generateImage = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/png',
          aspectRatio: '1:1',
        },
    });
    
    const base64ImageBytes = response.generatedImages[0]?.image?.imageBytes;
    if (!base64ImageBytes) {
      throw new Error('No image was generated. The response may have been blocked.');
    }
    
    return `data:image/png;base64,${base64ImageBytes}`;
  } catch (error) {
    console.error('Error generating image:', error);
    throw new Error('Image generation failed. The prompt might have been rejected. Please revise your prompt and try again.');
  }
};

export const editImage = async (prompt: string, imageFile: File, mode: EditMode): Promise<string> => {
    let internalPrompt = '';
    switch(mode) {
        case 'changeCloth':
            internalPrompt = `Based on the user's prompt "${prompt}", change only the clothing of the person in the image. Maintain the original person, pose, and background.`;
            break;
        case 'changeBackground':
            internalPrompt = `Based on the user's prompt "${prompt}", change only the background of the image. Keep the foreground subjects (people, objects) exactly as they are.`;
            break;
        default:
            throw new Error('Invalid edit mode specified.');
    }

    try {
        const imagePart = await fileToGenerativePart(imageFile);
        const textPart = { text: internalPrompt };

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: { parts: [imagePart, textPart] },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });

        const imageContentPart = response.candidates?.[0]?.content?.parts.find(part => part.inlineData);

        if (!imageContentPart || !imageContentPart.inlineData) {
            const textResponse = response.text || "No specific reason provided.";
            throw new Error(`The model could not edit the image. Reason: ${textResponse}`);
        }

        const base64ImageBytes: string = imageContentPart.inlineData.data;
        const mimeType: string = imageContentPart.inlineData.mimeType;

        return `data:${mimeType};base64,${base64ImageBytes}`;
    } catch(error) {
        console.error('Error editing image:', error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('An unexpected error occurred while editing the image.');
    }
};