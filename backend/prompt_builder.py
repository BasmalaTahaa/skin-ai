import os
from groq import Groq

client = Groq(api_key=os.getenv("GROK_API_KEY"))


def build_prompt(
    user_message: str | None,
    prediction: str,
    confidence: float,
    mode: str = "user"  # "auto" or "user"
) -> tuple[str, str]:
    """
    Builds a safe, friendly, English-only prompt for Grok chatbot.

    mode = "auto"  -> proactive first message
    mode = "user"  -> reply after user asks
    """

    # =========================
    # System Prompt (Rules)
    # =========================
    system_prompt = """
You are a friendly AI skincare assistant.

IMPORTANT RULES:
- You are NOT a doctor.
- You MUST NOT provide medical diagnosis.
- You give general skincare advice only.
- Always be calm, reassuring, and supportive.
- If the condition may be serious, gently advise seeing a dermatologist.
- Do NOT use scary language.
- Use a warm, friendly, caring tone.
- Use emojis lightly 💖✨
- Always respond in ENGLISH.
- If the user is unsure, ask a gentle follow-up question.
"""

    # =========================
    # Proactive Message
    # =========================
    if mode == "auto":
        user_prompt = f"""
The user has just received their skin analysis result.

Analysis result:
- Detected condition: {prediction}
- Confidence: {confidence}%

Your task:
1. Start the conversation proactively.
2. Reassure the user that there is no need to panic.
3. Explain the result in very simple language.
4. Clearly state that this is NOT a medical diagnosis.
5. Ask the user what they would like next:
   - General skincare tips
   - A simple daily routine
   - Or to ask a specific question
6. Encourage them to continue chatting.

Be kind, warm, and supportive 💕
"""
    # =========================
    # Normal User Message
    # =========================
    else:
        user_prompt = f"""
Skin analysis context:
- Detected condition: {prediction}
- Confidence: {confidence}%

User message:
{user_message}

Your task:
- Reply naturally and clearly.
- Give helpful skincare advice.
- Keep the tone friendly, calm, and reassuring.
- Avoid medical diagnosis.
- If appropriate, ask a follow-up question.
"""

    return system_prompt.strip(), user_prompt.strip()


def chat_with_user(
    message: str | None,
    diagnosis: str,
    confidence: float,
    proactive: bool = False
):
    """
    Main function used by the API
    """

    mode = "auto" if proactive else "user"

    system_prompt, user_prompt = build_prompt(
        user_message=message,
        prediction=diagnosis,
        confidence=confidence,
        mode=mode
    )

    response = client.chat.completions.create(
        model="llama3-70b-8192",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
    )

    return response.choices[0].message.content
