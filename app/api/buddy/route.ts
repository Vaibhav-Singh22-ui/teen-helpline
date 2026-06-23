import { NextResponse } from 'next/server';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

// Robust offline mock engine for Buddy in case of api errors or missing key
const generateMockBuddyResponse = (message: string, mood: string, personality: string): string => {
  const msg = message.toLowerCase();
  
  // Crisis safety check
  if (
    msg.includes('suicide') || 
    msg.includes('self-harm') || 
    msg.includes('kill myself') || 
    msg.includes('end my life') || 
    msg.includes('cutting myself') ||
    msg.includes('marna chahta') ||
    msg.includes('die')
  ) {
    return "SAFETY_CRISIS_TRIGGER";
  }

  // Hinglish greetings & common queries
  if (msg.includes('kya hua') || msg.includes('kaise ho') || msg.includes('hello buddy') || msg.includes('hey buddy') || msg.includes('hi buddy')) {
    if (personality === 'Cheerful') {
      return "Hey dost! Main bilkul badhiya hoon! Aap batao, aaj ka din kaisa raha? Main aapki har baat sunne ke liye ready hoon! 😊";
    } else if (personality === 'Wise') {
      return "Namaste dost. Main thik hoon. Aap batao, aaj aapke mann mein kya chal raha hai? Koi aisi baat jo aap share karna chahte ho? 🌸";
    } else {
      return "Hello friend. Main yahan bilkul thik hoon aur aapki help ke liye present hoon. Take a deep breath and tell me, how has your day been? 🕊️";
    }
  }

  if (msg.includes('stressed') || msg.includes('exam') || msg.includes('tension') || msg.includes('board exam') || msg.includes('padhai')) {
    return "Exam tension is very real, dost. Par please yaad rakho, aapki worth ek sheet of paper se zyada hai. Kyun na hum ek 2-minute breathing exercise karein in the Calm Zone? It really helps to clear your mind. Main yahi hoon.";
  }

  if (msg.includes('sad') || msg.includes('lonely') || msg.includes(' अकेला') || msg.includes('udaas')) {
    return "I am so sorry you are feeling this way. Sometimes feeling lonely makes us think nobody cares, but please know you are not alone. Main yahan hoon, aur hum milkar isse handle karenge. What's one small thing that made you smile recently?";
  }

  if (msg.includes('thank') || msg.includes('shukriya') || msg.includes('thanks')) {
    return "Aww, anytime dost! Buddy is always in your corner. Aap jab chahein mujhse baat kar sakte hain. 😊 You are doing great!";
  }

  // Default personality responses
  if (personality === 'Cheerful') {
    return "Aapki baat sunkar achha laga! Life mein choti-choti tension aati rehti hain, par tension nahi lene ka! Buddy aapke saath hai. Chal, share your favorite game or tell me what else is on your mind! ✨";
  } else if (personality === 'Wise') {
    return "Har ek feeling hume kuch sikhati hai. Stressed feel karna normal hai. It just means you care about your future. Let's focus on what you can control today, even if it's a very small step. 🌿";
  } else {
    return "Thank you for sharing that with me. I hear you, and your feelings are completely valid. We don't have to fix everything right now, just take it one step at a time. I am listening. 🌊";
  }
};

export async function POST(req: Request) {
  try {
    const { message, history, mood, buddyConfig } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY || '';

    // Safety checks on input
    const cleanMessage = (message || '').toLowerCase();
    const isCrisis = 
      cleanMessage.includes('suicide') || 
      cleanMessage.includes('self-harm') || 
      cleanMessage.includes('kill myself') || 
      cleanMessage.includes('end my life') || 
      cleanMessage.includes('cutting myself') ||
      cleanMessage.includes('marna chahta') ||
      cleanMessage.includes('die') ||
      cleanMessage.includes('zindagi khatam') ||
      cleanMessage.includes('suicidal');

    if (isCrisis) {
      return NextResponse.json({
        reply: "SAFETY_CRISIS_TRIGGER",
        isCrisis: true
      });
    }

    if (!apiKey) {
      // Fallback if no API key configured
      const reply = generateMockBuddyResponse(message, mood, buddyConfig?.personality || 'Cheerful');
      return NextResponse.json({ reply, isCrisis: false });
    }

    // Construct system instructions
    const systemPrompt = `You are a supportive, warm, human, caring, and judgment-free companion named "${buddyConfig?.name || 'Buddy'}" for a teenager (13-17 years old) in India.
Your avatar style is "${buddyConfig?.avatar || 'default'}" and your personality profile is "${buddyConfig?.personality || 'Cheerful'}".
- Cheerful: High-energy, optimistic, validates emotions but lifts spirits, uses supportive emojis, friendly tone.
- Calm: Serene, quiet, validation-focused, slow pace, peaceful imagery, helps reduce heart rates.
- Wise: Understanding, philosophical, helps teens reframe thoughts, thoughtful, encourages long-term perspective.

Core Instructions:
1. Speak in a mix of English, Hindi, and Hinglish. E.g., if they say "Main bohot tired hoon", respond with empathy like "I understand, dost. Tired feel hona bilkul normal hai. Kyun na thoda break le lo?"
2. You are NOT a medical professional, therapist, or chatbot. You are a supportive virtual friend.
3. Validate their feelings. Do not just offer solutions immediately. Say things like "That sounds really hard," "I hear you," "No wonder you feel this way."
4. KEEP RESPONSES CONCISE (maximum 3-4 sentences) so teens can read them easily on mobile screens. Avoid giant blocks of text.
5. Do NOT use purple, futuristic glowing AI startup language. Use human-to-human warm vocabulary.
6. Support their selected mood context: Current mood is "${mood}". Adjust response tone slightly to match.
7. CRITICAL SAFETY: If the user says anything indicating self-harm, suicidal thoughts, abuse, or crisis, output EXACTLY the phrase "SAFETY_CRISIS_TRIGGER" so the client can intercept it. Do not generate a standard chat response for crisis.`;

    // Map conversation history to Gemini schema
    const formattedContents = [];
    if (history && history.length > 0) {
      // Limit history to last 6 messages to keep context short and cheap
      const recentHistory = history.slice(-6);
      for (const h of recentHistory) {
        formattedContents.push({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }]
        });
      }
    }
    // Append current message
    formattedContents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    // Call Gemini API
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: formattedContents,
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        },
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 250
        }
      })
    });

    if (!response.ok) {
      console.error('Gemini API returned error code:', response.status);
      const fallbackReply = generateMockBuddyResponse(message, mood, buddyConfig?.personality || 'Cheerful');
      return NextResponse.json({ reply: fallbackReply, isCrisis: false });
    }

    const resData = await response.json();
    const replyText = resData?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    if (replyText.includes("SAFETY_CRISIS_TRIGGER")) {
      return NextResponse.json({
        reply: "SAFETY_CRISIS_TRIGGER",
        isCrisis: true
      });
    }

    return NextResponse.json({
      reply: replyText.trim(),
      isCrisis: false
    });

  } catch (error) {
    console.error('Error in Buddy Route Handler:', error);
    return NextResponse.json({
      reply: "Hmm, dost, lagta hai network mein thoda issue hai. Par main sun raha hoon! Kya chal raha hai aapke mann mein?",
      isCrisis: false
    });
  }
}
