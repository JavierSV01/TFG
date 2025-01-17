from pymongo import MongoClient
from flask import current_app, json
from bson.objectid import ObjectId

class ChatModel:
    @staticmethod
    def get_db():
        mongo_uri = current_app.config.get("MONGO_URI")
        client = MongoClient(mongo_uri)
        db_name = mongo_uri.split("/")[-1]  # Extrae el nombre de la base de datos de la URI
        db = client[db_name]
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
        chat = db.chat.find({
            "_id": chatId
        })

        return chat
    
    
    