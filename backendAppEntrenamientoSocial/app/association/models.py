from pymongo import MongoClient
from flask import current_app, json
from app.user.helpers import get_one_workout_for_user
from bson.objectid import ObjectId

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
    def insertWorkout(usuario_cliente, usuario_entrenador, entrenamiento, date):
        db = AssociationModel.get_db()
        db.asesoramientos.update_one(
            {"usuarioCliente": usuario_cliente, "usuarioEntrenador": usuario_entrenador},
            {"$push": {"entrenamientos": {"_id":ObjectId(),"entrenamiento": entrenamiento, "fecha": date}}}
        )
    
    @staticmethod
    def removeWorkout(usuario_cliente, usuario_entrenador, id_workout):
        db = AssociationModel.get_db()
        result = db.asesoramientos.update_one(
            {"usuarioCliente": usuario_cliente, "usuarioEntrenador": usuario_entrenador},
            {"$pull": {"entrenamientos": {"_id": ObjectId(id_workout)}}}
        )
        return result
    
    @staticmethod
    def updateWorkout(usuario_cliente, usuario_entrenador, id_workout, entrenamiento, estado, semIndex, dayIndex):
        db = AssociationModel.get_db()
        result = db.asesoramientos.update_one(
            {"usuarioCliente": usuario_cliente, "usuarioEntrenador": usuario_entrenador, "entrenamientos._id": ObjectId(id_workout)},
            {"$set": {f"entrenamientos.$.entrenamiento.0.weeks.{semIndex}.days.{dayIndex}.exercises": entrenamiento, f"entrenamientos.$.entrenamiento.0.weeks.{semIndex}.days.{dayIndex}.estado": estado}}
        )
        return result
    
    @staticmethod
    def putDiet(usuario_cliente, usuario_entrenador, dieta, date):
        db = AssociationModel.get_db()
        db.asesoramientos.update_one(
            {"usuarioCliente": usuario_cliente, "usuarioEntrenador": usuario_entrenador},
            {"$set": {"dietaData": {"dieta": dieta, "fecha": date}}}
        )