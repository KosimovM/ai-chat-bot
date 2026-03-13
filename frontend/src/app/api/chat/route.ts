import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI Client
// We use process.env to read the keys securely on the server
const openai = new OpenAI({
    apiKey: process.env.AI_API_KEY || 'dummy-key',
    baseURL: process.env.AI_BASE_URL, // Optional: for Groq or others
});

export const POST = async (req: Request) => {
    try {
        const body = await req.json();
        const { messages, model } = body;

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
        }

        // Simplest implementation: Non-streaming for MVP
        // In valid MVP 2.0 we might want to stream using 'ai' package, 
        // but let's stick to simple request/response as per plan for stability first.
        const completion = await openai.chat.completions.create({
            model: process.env.AI_MODEL || 'gpt-3.5-turbo',
            messages: messages.map((m: any) => ({
                role: m.role,
                content: m.content
            })),
            // max_tokens: 500, // Optional
        });

        const reply = completion.choices[0]?.message?.content || "No response generated.";

        return NextResponse.json({ 
            role: 'assistant',
            content: reply
        });

    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: error?.message || 'Internal Server Error' }, 
            { status: 500 }
        );
    }
};
