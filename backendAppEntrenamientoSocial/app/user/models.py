from pymongo import MongoClient
from flask import current_app
from datetime import date

from .. import mongo

class UserModel:
    @staticmethod
    def get_db():
        db = mongo.db
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
    
    @staticmethod
    def update_dynamic_attribute(usuario, nombre_atributo, valor, fecha, valorTipo):

        db = UserModel.get_db()
        user = db.usuarios.find_one({"usuario": usuario})
        if not user:
            return False  

        atributo_existente = next((attr for attr in user.get("atributosDinamicos", []) if (attr["nombre"] == nombre_atributo) and attr["valorTipo"] == valorTipo), None)

        if atributo_existente:
            db.usuarios.update_one(
                {"usuario": usuario, "atributosDinamicos.nombre": nombre_atributo},
                {"$push": {"atributosDinamicos.$.historial": {"valor": valor, "fecha": fecha}}}
            )
        else:
            nuevo_atributo = {
                "nombre": nombre_atributo,
                "valorTipo" : valorTipo,
                "historial": [{"valor": valor, "fecha": fecha}]
            }
            db.usuarios.update_one(
                {"usuario": usuario},
                {"$push": {"atributosDinamicos": nuevo_atributo}}
            )
        return True
    
    @staticmethod
    def insert_diet_for_user(user, diet):
        db = UserModel().get_db()
        result = db.usuarios.update_one(
            {"usuario": user},
            {"$push": {"dietas": diet}}
        )
        return result
    
    @staticmethod
    def get_diets_for_user(user):
        db = UserModel.get_db()
        usuario = db["usuarios"].find_one({"usuario": user}, {"dietas": 1})
        return usuario.get("dietas", [])
    
    @staticmethod
    def get_one_diet_for_user(user, dietTitle):
        db = UserModel.get_db()
        usuario = db["usuarios"].find_one({"usuario": user}, {"dietas": 1})
        diets = usuario.get("dietas", [])
        dietResult = []
        for diet in diets:
            print(diet.get("title"), dietTitle)
            if diet.get("title") == dietTitle:
                dietResult.append(diet)
                return dietResult
        return None
    
    @staticmethod
    def exist_workout_with_title(user, title):
        db = UserModel.get_db()
        documento = db["usuarios"].find_one({
            'usuario': user,
            'plantillasDeEntrenamiento': {
                '$elemMatch': {
                    'title': title
                }
            }
        })
        if documento:
            return True
        return False
    
    @staticmethod
    def update_workout_for_user(user, titulo_entrenamiento_anterior, workout):
        db = UserModel().get_db()
        result = db.usuarios.update_one(
            {"usuario": user, "plantillasDeEntrenamiento.title": titulo_entrenamiento_anterior},
            {"$set": {
                "plantillasDeEntrenamiento.$.title": workout["title"],
                "plantillasDeEntrenamiento.$.description": workout["description"],
                "plantillasDeEntrenamiento.$.weeks": workout["weeks"],
            }}
        )
        return result
    
    @staticmethod
    def update_diet_for_user(user, titulo_dieta_anterior, dieta):
        db = UserModel().get_db()
        result = db.usuarios.update_one(
            {"usuario": user, "dietas.title": titulo_dieta_anterior},
            {"$set": {
                "dietas.$.title": dieta["dietName"],
                "dietas.$.days": dieta["days"],
            }}
        )
        return result
    
    @staticmethod
    def remove_workout_for_user(id_usuario, workoutTitle):
        db = UserModel().get_db()
        resultado = db.usuarios.update_one(
            {"usuario": id_usuario},
            {"$pull": {"plantillasDeEntrenamiento": {"title": workoutTitle}}}
        )
        return resultado
    
    @staticmethod
    def remove_diet_for_user(id_usuario, dietTitle):
        db = UserModel().get_db()
        resultado = db.usuarios.update_one(
            {"usuario": id_usuario},
            {"$pull": {"dietas": {"title": dietTitle}}}
        )
        return resultado
    
    @staticmethod
    def exist_diet_with_title(user, title):
        db = UserModel.get_db()
        documento = db["usuarios"].find_one({
            'usuario': user,
            'dietas': {
                '$elemMatch': {
                    'title': title
                }
            }
        })
        if documento:
            return True
        return False
    
    @staticmethod
    def set_profile_image(usuario, fileId):
        db = UserModel().get_db()
        resultado = db.usuarios.update_one(
            {"usuario": usuario},
            {"$set": {"imagenDePerfil": fileId}}
        )
        return resultado
    
    @staticmethod
    def get_profile_image(usuario):
        db = UserModel.get_db()
        usuario = db["usuarios"].find_one({"usuario": usuario}, {"imagenDePerfil": 1})
        imagen = usuario.get("imagenDePerfil", "")
        return imagen
    
    @staticmethod
    def push_evolution_image(usuario, fileId):
        db = UserModel().get_db()

        fecha_actual = date.today()
        fecha_formateada = fecha_actual.strftime("%Y-%m-%d")

        nuevo_atributo = {
            "fileId" : fileId,
            "fecha": fecha_formateada
        }

        resultado = db.usuarios.update_one(
            {"usuario": usuario},
            {"$push": {"evolucionFisica": nuevo_atributo}}
        )
        return resultado
    
    @staticmethod
    def get_favourite_post(usuario):
        db = UserModel.get_db()
        usuario = db.usuarios.find_one({"usuario": usuario}, {"postFavoritos": 1})
        post = usuario.get("postFavoritos", [])
        return post
    
    @staticmethod
    def add_favourite_post(usuario, post_object_id):
        db = UserModel.get_db()
        result = db.usuarios.update_one(
            {"usuario": usuario},
            {"$push": {"postFavoritos": post_object_id}}
        )
        return result
    
    @staticmethod
    def del_favourite_post(usuario, post_object_id):
        print("del")
        db = UserModel.get_db()
        result = db.usuarios.update_one(
            {"usuario": usuario},
            {"$pull": {"postFavoritos": post_object_id}}
        )
        return result


    
