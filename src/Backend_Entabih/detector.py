# detector.py
from pydantic import BaseModel
from fastapi import HTTPException
import httpx
import os
import re
from dotenv import load_dotenv

load_dotenv()

# Data models
class FraudCheckRequest(BaseModel):
    message: str

class FraudCheckResponse(BaseModel):
    classification: str
    percentage: float
    advice: str

# Constants
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
if not OPENROUTER_API_KEY:
    raise ValueError("OPENROUTER_API_KEY environment variable is not set")

OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"

# Classification logic
def classify_message(percentage: float) -> str:
    if percentage < 50:
        return "احتيالي"
    elif percentage < 85:
        return "مشبوه"
    else:
        return "سليم"

# Core logic
async def detect_fraud(request: FraudCheckRequest) -> FraudCheckResponse:
    # Prompt with PhD-level detail
    analysis_prompt = (
        "You are a highly specialized doctoral-level AI agent trained in advanced fraud detection and Arabic-language social engineering analysis.\n\n"
        "Your task is to assess the legitimacy of the following Arabic message by evaluating linguistic cues, behavioral patterns, urgency tone, impersonation of institutions, and indicators like unknown URLs, banking references, or phone numbers.\n\n"
        "Your analysis should reflect a comprehensive judgment based on:\n"
        "1. Contextual phrasing and psychological triggers.\n"
        "2. Use of banking terms or impersonation techniques.\n"
        "3. Suspicious requests such as credential updates or clicking external links.\n"
        "4. Abnormal formatting, urgency language, or vague sender identity.\n\n"
        "Return ONLY a number between 0 and 100 representing the legitimacy:\n"
        "- 0 = definitely fraudulent\n"
        "- 100 = fully legitimate\n\n"
        f"Message:\n{request.message}"
    )

    async with httpx.AsyncClient() as client:
        # Get percentage
        try:
            response = await client.post(
                OPENROUTER_API_URL,
                headers={
                    "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                    "Content-Type": "application/json",
                    "HTTP-Referer": "exp://localhost"
                },
                json={
                    "model": "openai/gpt-3.5-turbo",
                    "messages": [
                        {"role": "system", "content": "You are a fraud detection expert."},
                        {"role": "user", "content": analysis_prompt}
                    ],
                    "temperature": 0.1
                },
                timeout=30.0
            )

            if response.status_code != 200:
                raise HTTPException(status_code=500, detail="Error from OpenRouter API")

            content = response.json()["choices"][0]["message"]["content"].strip()
            match = re.search(r"\d{1,3}(?:\.\d+)?", content)
            percentage = float(match.group()) if match else 50
            percentage = max(0, min(100, percentage))
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to analyze message: {str(e)}")

        # Get advice
        classification = classify_message(percentage)
        advice_prompt = (
            f"أنت مساعد ذكي وخبير في تحليل الرسائل الاحتيالية.\n\n"
            f"الرسالة التالية تم تصنيفها على أنها: \"{classification}\" (بنسبة احتمال: {percentage}%).\n\n"
            f"قدم نصيحة قصيرة للمستخدم توضح له السبب المحتمل لهذا التصنيف، وكيف يتعامل مع الرسالة بحذر. استخدم اللغة العربية، ولا تتجاوز 3 جمل.\n\n"
            f"الرسالة:\n{request.message}"
        )

        try:
            advice_response = await client.post(
                OPENROUTER_API_URL,
                headers={
                    "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                    "Content-Type": "application/json",
                    "HTTP-Referer": "exp://localhost"
                },
                json={
                    "model": "openai/gpt-3.5-turbo",
                    "messages": [
                        {"role": "system", "content": "أنت خبير في كشف الاحتيال تقدم نصائح مختصرة للمستخدمين."},
                        {"role": "user", "content": advice_prompt}
                    ],
                    "temperature": 0.5,
                    "max_tokens": 150
                },
                timeout=30.0
            )

            if advice_response.status_code != 200:
                raise HTTPException(status_code=500, detail="Error from OpenRouter advice API")

            advice = advice_response.json()["choices"][0]["message"]["content"].strip()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to generate advice: {str(e)}")

        return FraudCheckResponse(
            classification=classification,
            percentage=percentage,
            advice=advice
        )
