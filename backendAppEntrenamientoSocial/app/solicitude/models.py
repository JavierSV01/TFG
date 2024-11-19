from pymongo import MongoClient
from flask import current_app

class SolicitudeModel:
    @staticmethod
    def get_db():
        mongo_uri = current_app.config.get("MONGO_URI")
        client = MongoClient(mongo_uri)
        db_name = mongo_uri.split("/")[-1]  # Extrae el nombre de la base de datos de la URI
        db = client[db_name]
        return db
    
    @staticmethod
    def get_solicitude(usuario):
        db = SolicitudeModel.get_db()
        solicitudes = db["solicitudes"].find({"usuarioEntrenador": usuario})
        return solicitudes
    
    @staticmethod
    def get_one_solicitude(usuarioCliente, usuarioEntrenador):
        db = SolicitudeModel.get_db()
        solicitudes = db["solicitudes"].find_one({"usuarioEntrenador": usuarioEntrenador, "usuarioCliente": usuarioCliente})
        return solicitudes
    
    @staticmethod
    def insert_solicitude(sol):
        db = SolicitudeModel.get_db()
        db["solicitudes"].insert_one(sol)
    
    @staticmethod
    def delete_solicitude(usuarioCliente, usuarioEntrenador):
        db = SolicitudeModel.get_db()
        db["solicitudes"].delete_one({
            "usuarioCliente": usuarioCliente,
            "usuarioEntrenador": usuarioEntrenador
        })
    
    
