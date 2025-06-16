from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import sqlite3
from backend.challenges.challenge_definitions import challenges

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PATH = "backend/db/sqlgym.db"

class EvalRequest(BaseModel):
    challenge_id: int
    user_answer: str

@app.get("/challenges")
def list_challenges():
    return [{"id": c["id"], "title": c["title"], "prompt": c["prompt"], "difficulty": c["difficulty"]} for c in challenges]

@app.get("/challenge/{challenge_id}")
def get_challenge(challenge_id: int):
    for c in challenges:
        if c["id"] == challenge_id:
            return {
                "id": c["id"],
                "title": c["title"],
                "prompt": c["prompt"],
                "difficulty": c["difficulty"]
            }
    raise HTTPException(status_code=404, detail="Challenge not found")

@app.post("/evaluate")
def evaluate_query(request: EvalRequest):
    # Find challenge
    challenge = next((c for c in challenges if c["id"] == request.challenge_id), None)
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")

    # Security: block dangerous commands
    if any(keyword in request.user_answer.lower() for keyword in ["drop", "delete", "update", "insert", "alter"]):
        raise HTTPException(status_code=400, detail="Dangerous SQL command detected")

    try:
        # Connect DB
        conn = sqlite3.connect(DB_PATH)

        # Get expected result from challenge SQL
        expected_df = pd.read_sql_query(challenge["solution_sql"], conn)
        # Get user-submitted result
        user_df = pd.read_sql_query(request.user_answer, conn)
        conn.close()

        # Compare columns
        if list(user_df.columns) != challenge["expected_columns"]:
            return {"success": False, "error": "Column mismatch", "user_columns": list(user_df.columns)}

        # Compare dataframes
        if user_df.equals(expected_df):
            return {"success": True, "message": "Correct!", "preview": user_df.head(5).to_dict(orient="records")}
        else:
            return {
                "success": False,
                "error": "Wrong result",
                "preview": user_df.head(5).to_dict(orient="records")
            }

    except Exception as e:
        return {"success": False, "error": str(e)}
