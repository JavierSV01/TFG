from pymongo import MongoClient
from flask import current_app
from werkzeug.security import generate_password_hash



class UserModel:
    @staticmethod
    def get_db():
        mongo_uri = current_app.config.get("MONGO_URI")
        client = MongoClient(mongo_uri)
        db_name = mongo_uri.split("/")[-1]  # Extrae el nombre de la base de datos de la URI
        db = client[db_name]
        # Crear el índice único para el campo 'usuario' (si no existe)
        db["usuarios"].create_index([('usuario', 1)], unique=True)
        return db

    @staticmethod
    def find_by_username(username):
        db = UserModel.get_db()
        return db["usuarios"].find_one({"usuario": username})

    @staticmethod
    def insert_user(usuario, contrasenaEncriptada, rol):
        db = UserModel.get_db()
        result = db["usuarios"].insert_one({'usuario': usuario, 'contrasenia': contrasenaEncriptada, 'rol': rol})
        return result.inserted_id
