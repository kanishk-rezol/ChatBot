from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
import os
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key="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", 
)
@app.post("/chat")
async def chat(req: Request):
    data = await req.json()
    user_msg = data.get("message", "")
    try:
        response = client.chat.completions.create(
            model="opengvlab/internvl3-14b:free",
            messages=[{"role": "user", "content": user_msg}],
        )
        return {"reply": response.choices[0].message.content}
    except Exception as e:
        return {"reply": f"Error: {str(e)}"}
