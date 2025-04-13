from flask import current_app
from pymongo import MongoClient

class PublicPostModel:
    @staticmethod
    def get_db():
        mongo_uri = current_app.config.get("MONGO_URI")
        client = MongoClient(mongo_uri)
        db_name = mongo_uri.split("/")[-1]  # Extrae el nombre de la base de datos de la URI
        db = client[db_name]
        return db
    
    @staticmethod
    def public_post(usuario, imageId, texto, tipo, fecha):
        post_data = {
            "usuario": usuario,
            "imagenId": imageId,
            "texto": texto,
            "fecha": fecha,
            "tipo": tipo
            
        }

        db = PublicPostModel.get_db()
        result = db["publicaciones"].insert_one(post_data)
        return result
