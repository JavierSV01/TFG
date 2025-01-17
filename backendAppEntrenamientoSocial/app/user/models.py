from pymongo import MongoClient
from flask import current_app

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
    
    @staticmethod
    def get_role(usuario):
        db = UserModel.get_db()
        usuario = db["usuarios"].find_one({"usuario": usuario}, {"rol": 1})
        return usuario

    @staticmethod
    def get_trainers(usuario):
        db = UserModel.get_db()
        entrenadores = db["usuarios"].find({"rol": "entrenador", "usuario": {"$ne": usuario}}, {"usuario":1})
        return entrenadores
    
    @staticmethod
    def insert_notification_for_user(user, noti):
        db = UserModel().get_db()
        db.usuarios.update_one(
            {"usuario": user},
            {"$push": {"notificaciones": noti}}
        )

    @staticmethod
    def insert_workout_for_user(user, workout):
        db = UserModel().get_db()
        result = db.usuarios.update_one(
            {"usuario": user},
            {"$push": {"plantillasDeEntrenamiento": workout}}
        )
        return result

    
    @staticmethod
    def update_data_for_user(user, data):
        db = UserModel.get_db()
        result = db.usuarios.update_one(
            {"usuario": user},
            {"$set": {"datos": data}}
        )
        return result.matched_count

    @staticmethod
    def get_workouts_for_user(user):
        db = UserModel.get_db()
        usuario = db["usuarios"].find_one({"usuario": user}, {"plantillasDeEntrenamiento": 1})
        return usuario.get("plantillasDeEntrenamiento", [])
    
    @staticmethod
    def get_one_workout_for_user(user, workoutTitle):
        db = UserModel.get_db()
        usuario = db["usuarios"].find_one({"usuario": user}, {"plantillasDeEntrenamiento": 1})
        workouts = usuario.get("plantillasDeEntrenamiento", [])
        workoutResult = []
        for workout in workouts:
            print(workout.get("title"), workoutTitle)
            if workout.get("title") == workoutTitle:
                workoutResult.append(workout)
                return workoutResult
        return None
    
    @staticmethod
    def user_exists(username):
        db = UserModel.get_db()
        return True if db["usuarios"].find_one({"usuario": username}) else False