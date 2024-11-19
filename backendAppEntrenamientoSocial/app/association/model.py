from pymongo import MongoClient
from flask import current_app

class AssociationModel:
    @staticmethod
    def get_db():
        mongo_uri = current_app.config.get("MONGO_URI")
        client = MongoClient(mongo_uri)
        db_name = mongo_uri.split("/")[-1]  # Extrae el nombre de la base de datos de la URI
        db = client[db_name]
        return db
    
    @staticmethod
    def existAssociation(usuario_cliente, usuario_entrenador):
        db = AssociationModel.get_db()
        asesoramiento = db.asesoramientos.find_one({
            "usuarioCliente": usuario_cliente,
            "usuarioEntrenador": usuario_entrenador
        })
        if asesoramiento is None:
            return False
        else:
            return True
        
    @staticmethod
    def insertAssociation(association):
        db = AssociationModel.get_db()
        db.asesoramientos.insert_one(association)   