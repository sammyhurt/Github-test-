import os
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Optional
import anthropic
from dotenv import load_dotenv
from policies import FULL_POLICY_CONTEXT

load_dotenv()

app = FastAPI(title="Haven Engine — Subletly Policy Assistant")

# ---------------------------------------------------------------------------
# System prompt — Haven Engine persona + injected policy context
# ---------------------------------------------------------------------------

SYSTEM_PROMPT = f"""You are Haven Engine, Subletly's Policy & Privacy Assistant.

CORE IDENTITY ("SOUL"):
- You embody Subletly's mission: a secure sanctuary for mid-term renters and a safety net for hosts so no one feels stranded during transitions.
- You speak with calm, motherly warmth: reassuring, steady, non-judgmental, supportive.
- You help users feel oriented and safe, especially in stressful moments.

STRICT SCOPE ("LOGIC"):
- You may answer ONLY using Subletly's Terms of Service and Privacy Policy content provided below.
- If the answer is not explicitly supported by the policy text below, you must say:
  "This is not specified in Subletly's Terms of Service or Privacy Policy."

NON-NEGOTIABLE RULES:
- Always cite policy sections (section title + short quoted snippet). Max 2 short quotes per response.
- No legal advice: explain what the policy says, not what the user should do legally.
- Do not invent product features, pricing, workflows, response times, or guarantees.
- If the user asks how to bypass rules, exploit verification, evade fees, scam, or engage in harmful behavior:
  refuse clearly and cite relevant policy sections.

RESPONSE FORMAT (always follow this order):
1) Warm opener (1–2 sentences, empathetic and steady).
2) Answer (clear and direct).
3) Policy basis (cite section title + short quoted snippet from the policy text below).
4) "Not specified" notice (only if part of the answer isn't covered by policy).
5) Next step (support/reporting/data request/dispute steps if in policy; otherwise "contact support at support@subletly.com").

--- SUBLETLY POLICY DOCUMENTS (your sole knowledge source) ---

{FULL_POLICY_CONTEXT}

--- END OF POLICY DOCUMENTS ---
"""

# ---------------------------------------------------------------------------
# Request / Response models
# ---------------------------------------------------------------------------

class Message(BaseModel):
    role: str  # "user" or "assistant"
    content: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[Message]] = []

class ChatResponse(BaseModel):
    response: str

# ---------------------------------------------------------------------------
# Chat endpoint
# ---------------------------------------------------------------------------

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="ANTHROPIC_API_KEY is not set. Add it to your .env file."
        )

    client = anthropic.Anthropic(api_key=api_key)

    # Build message history for multi-turn conversation
    messages = []
    for msg in (request.history or []):
        messages.append({"role": msg.role, "content": msg.content})

    # Append the new user message
    messages.append({"role": "user", "content": request.message})

    try:
        response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=1024,
            system=SYSTEM_PROMPT,
            messages=messages,
        )
        reply = response.content[0].text
    except anthropic.AuthenticationError:
        raise HTTPException(status_code=401, detail="Invalid Anthropic API key.")
    except anthropic.APIConnectionError:
        raise HTTPException(status_code=503, detail="Could not connect to Anthropic API.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return ChatResponse(response=reply)

# ---------------------------------------------------------------------------
# Health check
# ---------------------------------------------------------------------------

@app.get("/health")
async def health():
    return {"status": "ok", "assistant": "Haven Engine"}

# ---------------------------------------------------------------------------
# Serve static files (chat UI)
# ---------------------------------------------------------------------------

app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
async def root():
    return FileResponse("static/index.html")

# ---------------------------------------------------------------------------
# Run directly with: python main.py
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
