# 💬 AI Chatbot with FastAPI + React

This is a full-stack chatbot application that uses **OpenRouter AI models** with a **FastAPI backend** and a **React frontend**. Messages are stored in `localStorage` to persist chat across refreshes.

---

## ✨ Features

- ✅ Real-time chat using OpenRouter AI
- ✅ Messages persist after refresh via localStorage
- ✅ Styled with Tailwind CSS
- ✅ FastAPI backend for handling chat requests
- ✅ React frontend with dynamic UI

---

## 📁 Project Structure

openrouter-chatbot/
├── backend/
│ ├── main.py # FastAPI server
│ ├── requirements.txt
├── frontend/
│ ├── src/
│ │ ├── App.tsx
│ │ ├── components/Chatbot.tsx
│ ├── tailwind.config.js
│ ├── package.json
│ └── ...

---
## Setup and Run the Application

### 1. Activate the Virtual Environment

For Windows:

```bash
.\.env\Scripts\Activate

```

```bash
uvicorn main:app --reload

```


## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/kanishk-rezol/ChatBot

