from flask import current_app, json
from bson.objectid import ObjectId
from flask_pymongo import PyMongo
from .. import mongo
class ChatModel:
    @staticmethod
    def get_db():
        db = mongo.db
        return db
    
    @staticmethod
    def get_chat_id(uid1, uid2):
        db = ChatModel.get_db()
        chat = db.chat.find_one({"usuarios": {"$all": [uid1, uid2], "$size": 2}})
        if chat:
            return str(chat["_id"])
        else:
            new_chat = {"usuarios": [uid1, uid2]}
            result = db.chat.insert_one(new_chat)
            return str(result.inserted_id)
        
    @staticmethod
    def get_chat_by_id(chat_id):
        db = ChatModel.get_db()
        chat = db.chat.find_one({
            "_id": ObjectId(chat_id)
        })

        return chat
    
    @staticmethod
    def insert_message(room, username, mensaje, fecha):
        db = ChatModel.get_db()
        chat_id = ObjectId(room)
        nuevo_mensaje = {
            "username": username,
            "mensaje": mensaje,
            "fecha": fecha
        }
        return db.chat.update_one(
            {"_id": chat_id},
            {"$push": {"mensajes": nuevo_mensaje}}
        )
    
    @staticmethod
    def get_chats_by_user(username):
        db = ChatModel.get_db()
        chats = db.chat.find({"usuarios": username})

        lista_de_chats = []
        for objeto in chats:
            # Los ObjectId no son serializables a JSON por defecto,
            # necesitamos convertirlos a string
            objeto['_id'] = str(objeto['_id'])
            lista_de_chats.append(objeto)

        return lista_de_chats
    
    @staticmethod
    def notify_chat(id):
        db = ChatModel.get_db()
        objeto_mongo_id = ObjectId(id)
        objeto = db.chat.find_one({'_id': objeto_mongo_id})

        usuarios = objeto.get('usuarios')
        if isinstance(usuarios, list):
            print(f'Notificando a usuarios del chat {id}: {usuarios}')
            db.chat.update_one(
                {'_id': objeto_mongo_id},
                {'$set': {'notificar': usuarios}}
            )

    @staticmethod
    def des_notify_chat(id, username):
        db = ChatModel.get_db()
        objeto_mongo_id = ObjectId(id)
        objeto = db.chat.find_one({'_id': objeto_mongo_id})

        usuarios = objeto.get('usuarios')
        if isinstance(usuarios, list):
            print(f'Notificando a usuarios del chat {id}: {usuarios}')
            db.chat.update_one(
                {'_id': objeto_mongo_id},
                {'$pull': {'notificar': username}}
            )



        


    
    