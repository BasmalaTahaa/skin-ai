import os
import requests

# ======================
# Grok API Config
# ======================

GROK_API_KEY = os.getenv("GROK_API_KEY")

GROK_API_URL = "https://api.x.ai/v1/chat/completions"
# Common Grok model names - try these in order
POSSIBLE_MODELS = [
    "grok-beta",
    "grok-2",
    "grok-2-latest",
    "grok-2-1212",  # Date-based version
]

# Try to use Groq SDK as fallback if available
try:
    from groq import Groq
    GROQ_AVAILABLE = True
    groq_client = Groq(api_key=GROK_API_KEY) if GROK_API_KEY else None
except ImportError:
    GROQ_AVAILABLE = False
    groq_client = None

if not GROK_API_KEY:
    raise RuntimeError(
        "GROK_API_KEY is not set. "
        "Please add it as an environment variable."
    )

# ======================
# Grok Request Function
# ======================

def ask_grok(system_prompt: str, user_prompt: str) -> str:
    """
    Sends a chat completion request to Grok API
    and returns the assistant reply as text.
    Tries multiple model names if one fails.
    """

    headers = {
        "Authorization": f"Bearer {GROK_API_KEY}",
        "Content-Type": "application/json",
    }

    last_error = None
    
    # Try each model name until one works
    for model_name in POSSIBLE_MODELS:
        payload = {
            "model": model_name,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            "temperature": 0.7,
            "max_tokens": 1000,
        }

        try:
            response = requests.post(
                GROK_API_URL,
                headers=headers,
                json=payload,
                timeout=30
            )

            if response.ok:
                data = response.json()
                
                if "choices" not in data or len(data["choices"]) == 0:
                    raise ValueError(f"Invalid response format: {data}")

                return data["choices"][0]["message"]["content"]
            else:
                # Try to get error details
                error_detail = "Unknown error"
                try:
                    error_data = response.json()
                    error_detail = error_data.get("error", {}).get("message", str(error_data))
                except:
                    error_detail = response.text[:200]
                
                last_error = f"Model '{model_name}' failed ({response.status_code}): {error_detail}"
                # Continue to next model
                continue
        
        except requests.exceptions.RequestException as e:
            last_error = f"Request failed for model '{model_name}': {str(e)}"
            continue
    
    # If all models failed, try Groq SDK as fallback
    if GROQ_AVAILABLE and groq_client:
        try:
            response = groq_client.chat.completions.create(
                model="llama3-70b-8192",  # Groq model
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ]
            )
            return response.choices[0].message.content
        except Exception as groq_error:
            raise RuntimeError(
                f"Both X.AI Grok API and Groq SDK failed.\n"
                f"X.AI Error: {last_error}\n"
                f"Groq Error: {str(groq_error)}\n"
                f"Please check:\n"
                f"1. GROK_API_KEY is correct\n"
                f"2. API endpoint is accessible\n"
                f"3. You have access to the API service"
            )
    
    # If all models failed, raise with detailed error
    raise RuntimeError(
        f"All Grok models failed. Last error: {last_error}\n"
        f"Please check:\n"
        f"1. GROK_API_KEY is correct\n"
        f"2. API endpoint is accessible\n"
        f"3. Model names are correct for your API key\n"
        f"Note: If you're using Groq API, install: pip install groq"
    )
