from pymongo import MongoClient
from flask import current_app, json
from app.user.helpers import get_one_workout_for_user

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

    @staticmethod
    def getClientsByTrainer(usuario_entrenador):
        db = AssociationModel.get_db()
        asociaciones = db.asesoramientos.find({
            "usuarioEntrenador": usuario_entrenador
        })
        clientes = [asociacion["usuarioCliente"] for asociacion in asociaciones]
        return clientes
    
    @staticmethod
    def getAssociationByUser(usuario_cliente):
        db = AssociationModel.get_db()
        asociaciones = db.asesoramientos.find({
            "usuarioCliente": usuario_cliente
        })
        datos = []
        for asociacion in asociaciones:
            datos.append(asociacion)
        return datos
    
    @staticmethod
    def insert_workout(usuario_cliente, usuario_entrenador, entrenamiento, date):
        db = AssociationModel.get_db()
        db.asesoramientos.update_one(
            {"usuarioCliente": usuario_cliente, "usuarioEntrenador": usuario_entrenador},
            {"$push": {"entrenamientos": {"entrenamiento": entrenamiento, "fecha": date}}}
        )