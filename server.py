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


def get_connection():
    """
    Crée une nouvelle connexion à la base de données.
    Nécessaire en environnement serverless (Vercel) où les connexions
    persistantes ne sont pas maintenues entre les invocations.
    """
    try:
        return mysql.connector.connect(
            database=os.getenv("MYSQL_DATABASE"),
            user=os.getenv("MYSQL_USER"),
            password=os.getenv("MYSQL_ROOT_PASSWORD"),
            port=int(os.getenv("MYSQL_PORT", "3306")),
            host=os.getenv("MYSQL_HOST"),
            connect_timeout=10,
            ssl_disabled=False,         # Requis pour Railway (connexions externes via SSL)
            ssl_verify_cert=False,      # Pas besoin de vérifier le certificat Railway
            ssl_verify_identity=False,
        )
    except mysql.connector.Error as e:
        raise HTTPException(
            status_code=503,
            detail=f"Database connection failed: {e}"
        )


class User(BaseModel):
    nom: str
    prenom: str
    dateNaissance: str
    ville: str
    codePostal: str
    email: str
    password: str


class LoginUser(BaseModel):
    email: str
    password: str


@app.on_event("startup")
async def startup_event():
    admin_email = os.getenv("ADMIN_EMAIL")
    admin_password = os.getenv("ADMIN_PASSWORD")
    if admin_email and admin_password:
        try:
            conn = get_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT id FROM users WHERE email = %s", (admin_email,))
            if not cursor.fetchone():
                sql = """INSERT INTO users (nom, prenom, dateNaissance, ville, codePostal, email, password, is_admin)
                         VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"""
                cursor.execute(sql, ("Admin", "Admin", "1970-01-01", "AdminCity", "00000", admin_email, admin_password, 1))
                conn.commit()
                print(f"Admin user {admin_email} created successfully.")
            cursor.close()
            conn.close()
        except Exception as e:
            print(f"Error creating admin user: {e}")


@app.get("/users")
async def get_users():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users")
    records = cursor.fetchall()
    cursor.close()
    conn.close()
    return {'utilisateurs': records}


@app.post("/users", status_code=201)
async def create_user(user: User):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        sql = """INSERT INTO users (nom, prenom, dateNaissance, ville, codePostal, email, password)
                 VALUES (%s, %s, %s, %s, %s, %s, %s)"""
        cursor.execute(sql, (
            user.nom, user.prenom, user.dateNaissance,
            user.ville, user.codePostal, user.email, user.password
        ))
        conn.commit()
        last_id = cursor.lastrowid
        cursor.close()
        conn.close()
        return {"message": "Utilisateur créé", "id": last_id}
    except mysql.connector.IntegrityError:
        raise HTTPException(status_code=409, detail="Email déjà utilisé")


@app.post("/login")
async def login(user: LoginUser):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE email = %s AND password = %s", (user.email, user.password))
    db_user = cursor.fetchone()
    cursor.close()
    conn.close()
    if not db_user:
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")
    return {"message": "Connexion réussie", "user": db_user}


@app.delete("/users/{user_id}")
async def delete_user(user_id: int):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM users WHERE id = %s", (user_id,))
    conn.commit()
    rows = cursor.rowcount
    cursor.close()
    conn.close()
    if rows == 0:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    return {"message": "Utilisateur supprimé"}
