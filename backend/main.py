from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from pydantic import BaseModel
from typing import List, Literal

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key="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"
)
class Message(BaseModel):
    role: Literal["user", "assistant"]
    content: str

class ChatHistory(BaseModel):
    chatHistory: List[Message]  

@app.post("/chat")
async def chat_endpoint(chat: ChatHistory):
    messages = chat.chatHistory
    if not messages:
        return {"reply": "No chat history provided."}

    conversation_history = [
        {"role": "user", "content": msg.content} if msg.role == "user" else {"role": "assistant", "content": msg.content}
        for msg in messages
    ]
    new_user_input = {"role": "user", "content": "Your new user input here"}  
    conversation_history.append(new_user_input)

    try:
        response = client.chat.completions.create(
            model="opengvlab/internvl3-14b:free",
            messages=conversation_history, 
        )
        bot_reply = response.choices[0].message.content 
    except Exception as e:
        bot_reply = f"Error: {str(e)}"
    print("\n--- Chat History Sent to Model ---")
    for msg in conversation_history:
        print(f"{msg['role']}: {msg['content']}")
    print("assistant:", bot_reply)

    return {"reply": bot_reply}



# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from openai import OpenAI
# from pydantic import BaseModel
# from typing import List, Literal
# app = FastAPI()
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:3000"],
#     allow_methods=["*"],
#     allow_headers=["*"],
# )
# api_key = ""
# client = OpenAI(
#     base_url="https://openrouter.ai/api/v1",
#     api_key=api_key
# )
# class Message(BaseModel):
#     role: Literal["user", "assistant"]
#     content: str
# class ChatHistory(BaseModel):
#     chatHistory: List[Message]  

# @app.post("/chat")
# async def chat_endpoint(chat: ChatHistory):
#     messages = chat.chatHistory
#     if not messages:
#         return {"reply": "No chat history provided."}
#     conversation_history = [
#         {"role": "user", "content": msg.content} if msg.role == "user" else {"role": "assistant", "content": msg.content}
#         for msg in messages
#     ]
#     new_user_input = {"role": "user", "content": "Your new user input here"}  
#     conversation_history.append(new_user_input)

#     try:
#         response = client.chat.completions.create(
#             model="opengvlab/internvl3-14b:free",
#             messages=conversation_history, 
#         )
#         bot_reply = response.choices[0].message.content  
#     except Exception as e:
#         bot_reply = f"Error: {str(e)}"
#     print("\n--- Chat History Sent to Model ---")
#     for msg in conversation_history:
#         print(f"{msg['role']}: {msg['content']}")
#     print("assistant:", bot_reply)

#     return {"reply": bot_reply}
