# 🏋️ SQLGym

**SQLGym** is an interactive SQL challenge platform designed to help users practice SQL using realistic, fintech-style datasets — all in a clean local-first setup.

Built with a Python + FastAPI backend and a React + Tailwind frontend, SQLGym evaluates SQL queries safely and gives instant feedback using mock financial data (users, transactions, refunds, subscriptions).


## ✨ Features

- 🧠 15 realistic SQL challenges (from `BASIC` to `HARD`)
- 🔐 Secure backend with safe SQL evaluation (no DDL/DML)
- 🧾 Realistic mock financial datasets generated with `Faker`
- 💡 Frontend with challenge prompts, schema previews, and Monaco-based SQL editor
- ✅ Query correctness feedback with result previews
- ⚡ Local SQLite support for rapid development


<!-- ## 📸 Preview

| Challenge Page                                 | SQL Editor with Feedback                      |
|-----------------------------------------------|------------------------------------------------|
| ![Home](./screenshots/challenges.png)         | ![Editor](./screenshots/editor.png)           | -->


## 🚀 Getting Started

### 1. Clone and setup environment

```bash
git clone https://github.com/tsembp/SQL-Gym.git
cd SQL-Gym
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
````

### 2. Generate mock DB

```bash
python backend/db/db_seeder.py
```

### 3. Start backend

```bash
cd backend
uvicorn main:app --reload
```

### 4. Setup frontend

```bash
cd frontend/tailwindcss4
npm install
npm run dev
```


## 🗂️ Project Structure

```
sqlgym/
├── backend/
│   ├── main.py                 # FastAPI app
│   ├── challenge_definitions   # Challenges JSON
│   ├── db/
│   │   ├── db_seeder.py        # SQLite + Faker mock data
│   │   ├── models.py           # SQLAlchemy models
|   |   └── sqlgym.db           # Generated DB (gitignored)
├── frontend/
│   └── src/
│       ├── pages/
│       ├── api/
|       ...
```


## 🛠️ Tech Stack

* **Backend**: Python, FastAPI, SQLAlchemy, SQLite
* **Frontend**: React, TypeScript, Tailwind CSS, Vite
* **Editor**: Monaco Editor
* **Data**: Faker, Pandas


## 📈 Future Ideas

* 🤖 GPT-powered SQL hints
* 💬 AI assistant for each challenge
* 📊 Leaderboard or progress tracking


## 📄 License

MIT License © 2025 \[Panagiotis Tsembekis]