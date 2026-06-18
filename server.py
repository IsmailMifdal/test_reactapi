import mysql.connector
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create a connection to the database
conn = mysql.connector.connect(
    database=os.getenv("MYSQL_DATABASE"),
    user=os.getenv("MYSQL_USER"),
    password=os.getenv("MYSQL_ROOT_PASSWORD"),
    port=3306,
    host=os.getenv("MYSQL_HOST")
)

class User(BaseModel):
    nom: str
    prenom: str
    dateNaissance: str
    ville: str
    codePostal: str
    email: str
    password: str

@app.get("/users")
async def get_users():
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users")
    records = cursor.fetchall()
    print("Total number of rows in table: ", cursor.rowcount)
    return {'utilisateurs': records}

@app.post("/users", status_code=201)
async def create_user(user: User):
    try:
        cursor = conn.cursor()
        sql = """INSERT INTO users (nom, prenom, dateNaissance, ville, codePostal, email, password)
                 VALUES (%s, %s, %s, %s, %s, %s, %s)"""
        cursor.execute(sql, (
            user.nom, user.prenom, user.dateNaissance,
            user.ville, user.codePostal, user.email, user.password
        ))
        conn.commit()
        return {"message": "Utilisateur créé", "id": cursor.lastrowid}
    except mysql.connector.IntegrityError:
        raise HTTPException(status_code=409, detail="Email déjà utilisé")
