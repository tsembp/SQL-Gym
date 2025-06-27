from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import sqlite3
from challenge_definitions import challenges

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PATH = "db/sqlgym.db"

class EvalRequest(BaseModel):
    challenge_id: int
    user_answer: str

@app.get("/schema")
def get_db_schema():
    # Fetch the schema of database
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        # Query to get all tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        
        schema = {}
        for table_name in tables:
            table_name = table_name[0]
            cursor.execute(f"PRAGMA table_info({table_name});")
            columns = cursor.fetchall()
            schema[table_name] = {
                "columns": [{"name": col[1], "type": col[2], "nullable": not col[3]} for col in columns]
            }
        
        conn.close()
        return schema
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/tables/{table_name}/sample")
def get_table_sample(table_name: str, limit: int = 5):
    # Get a sample of data from a specific table
    try:
        conn = sqlite3.connect(DB_PATH)
        df = pd.read_sql_query(f"SELECT * FROM {table_name} LIMIT {limit}", conn)
        conn.close()
        return {"data": df.to_dict(orient="records")}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/challenges")
def list_challenges(difficulty: str = None):
    filtered_challenges = challenges

    if difficulty:
        difficulty = difficulty.capitalize()
        filtered_challenges = [c for c in challenges if c["difficulty"] == difficulty]

    return [{
        "id": c["id"],
        "title": c["title"],
        "prompt": c["prompt"],
        "difficulty": c["difficulty"],
        "hints": c.get("hints", []),
        "example_data": c.get("example_data", []),
    } for c in filtered_challenges]

@app.get("/challenge/{challenge_id}")
def get_challenge(challenge_id: int):
    for c in challenges:
        if c["id"] == challenge_id:
            return {
                "id": c["id"],
                "title": c["title"],
                "prompt": c["prompt"],
                "difficulty": c["difficulty"],
                "hints": c.get("hints", []),
                "example_data": c.get("example_data", []),
            }
    raise HTTPException(status_code=404, detail="Challenge not found")

@app.get("/challenge/{challenge_id}/solution")
def get_challenge_solution(challenge_id: int):
    for c in challenges:
        if c["id"] == challenge_id:
            return {
                "solution_sql": c["solution_sql"],
                "expected_columns": c["expected_columns"]
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
