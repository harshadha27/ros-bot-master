
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getROSAdvice = async (prompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `You are an expert ROS (Robot Operating System) engineer. 
      Help the user with their differential drive robot project. 
      Keep answers concise and technical. 
      Focus on topics like: teleop_keyboard, urdf modeling, motor controller nodes, and hardware wiring.
      
      User Question: ${prompt}`,
      config: {
        thinkingConfig: { thinkingBudget: 2000 }
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to my ROS knowledge base. Please check your network.";
  }
};

export const generateURDF = async (dimensions: { width: number, length: number, wheelRadius: number }) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a basic URDF XML for a differential drive robot with:
      Chassis Width: ${dimensions.width}m
      Chassis Length: ${dimensions.length}m
      Wheel Radius: ${dimensions.wheelRadius}m
      Include standard differential drive controller plugin.`,
    });
    return response.text;
  } catch (error) {
    return "Error generating URDF.";
  }
};
