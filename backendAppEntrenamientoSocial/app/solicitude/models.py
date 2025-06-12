from pymongo import MongoClient
from flask import current_app
from .. import mongo

class SolicitudeModel:
    @staticmethod
    def get_db():
        db = mongo.db
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
    
    
