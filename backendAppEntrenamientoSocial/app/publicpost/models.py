from flask import current_app
from pymongo import MongoClient, DESCENDING
from bson import ObjectId

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
    
    @staticmethod
    def public_post_type2(usuario, imageId, texto, tipo, meal, fecha):
        post_data = {
            "usuario": usuario,
            "imagenId": imageId,
            "texto": texto,
            "fecha": fecha,
            "tipo": tipo,
            "meal": meal,
            
            
        }

        db = PublicPostModel.get_db()
        result = db["publicaciones"].insert_one(post_data)
        return result
    @staticmethod
    def public_post_type3(usuario, imageId, texto, tipo, day, fecha):
        post_data = {
            "usuario": usuario,
            "imagenId": imageId,
            "texto": texto,
            "fecha": fecha,
            "tipo": tipo,
            "day": day,
            
            
        }

        db = PublicPostModel.get_db()
        result = db["publicaciones"].insert_one(post_data)
        return result

    @staticmethod
    def get_total_post():
        db = PublicPostModel.get_db()
        result = db["publicaciones"].count_documents({})
        return result
    
    @staticmethod
    def get_paginated_posts(limit, skip):
        db = PublicPostModel.get_db()
        result = db["publicaciones"].find({}).sort('fecha', DESCENDING).skip(skip).limit(limit)
        return result
    
    @staticmethod
    def get_posts_by_ids(post_ids):
        db = PublicPostModel.get_db()
        object_ids = [ObjectId(post_id) for post_id in post_ids]
        result = db["publicaciones"].find({"_id": {"$in": object_ids}})
        return list(result)
    
    @staticmethod
    def do_comment(usuario, postId, comentario, fecha):
        comentario_dict = {
            "usuario": usuario,
            "comentario": comentario,
            "fecha": fecha
        }

        db = PublicPostModel.get_db()
        result = db["publicaciones"].update_one(
            {"_id": ObjectId(postId)},
            {"$push": {"comentarios": comentario_dict}}
        )

        return result.modified_count > 0
    
    @staticmethod
    def get_likes(post_object_id):
        db = PublicPostModel.get_db()
        publicacion = db["publicaciones"].find_one({"_id": ObjectId(post_object_id)}, {"likes": 1})
        post = publicacion.get("likes", [])
        return post

    @staticmethod
    def add_like_post(usuario, post_object_id):
        print("add")
        db = PublicPostModel.get_db()
        result = db["publicaciones"].update_one(
            {"_id": ObjectId(post_object_id)},
            {"$push": {"likes": usuario}}
        )
        return result
    
    @staticmethod
    def del_like_post(usuario, post_object_id):
        print("del")
        db = PublicPostModel.get_db()
        result = db["publicaciones"].update_one(
            {"_id": ObjectId(post_object_id)},
            {"$pull": {"likes": usuario}}
        )
        return result