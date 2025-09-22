console.log("AI Chat API: Route file started");
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { HarmBlockThreshold, HarmCategory } from '@google/generative-ai';

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

export async function POST(req: NextRequest) {
  try {
    const { message, userId, history } = await req.json(); // Receive history from frontend

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    console.log("AI Chat API: Received message for userId:", userId, "Message:", message, "History length:", history?.length || 0);

    // Hardcode the API key directly
    const apiKey = "AIzaSyDIUrA9b1ibubFcOA9jdRUpQfqInVGpyE0"; 
    console.log("AI Chat API: GOOGLE_AI_API_KEY is hardcoded and loaded.");

    let genAI: GoogleGenerativeAI;
    try {
      genAI = new GoogleGenerativeAI(apiKey);
    } catch (genAIError) {
      console.error('Error initializing GoogleGenerativeAI:', genAIError);
      return NextResponse.json(
        { error: 'Failed to initialize AI service', details: (genAIError as Error).message },
        { status: 500 }
      );
    }
    
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash", safetySettings });
    const chat = model.startChat({ history }); // Start chat with history

    let text = "";
    try {
      const result = await chat.sendMessage(message); // Send only the new message
      console.log("AI Chat API: Raw Google AI response result:", JSON.stringify(result, null, 2));
      const response = result.response;
      text = response.text();
      console.log("AI Chat API: Extracted text from AI response:", text);
    } catch (aiError) {
      console.error('Error generating content from Google AI:', aiError);
      return NextResponse.json(
        { error: 'Failed to get response from AI', details: (aiError as Error).message },
        { status: 500 }
      );
    }

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error('Error in AI chat API (outer catch):', error);
    return NextResponse.json(
      { error: 'Failed to get response from AI', details: (error as Error).message },
      { status: 500 }
    );
  }
}
