from pymongo import MongoClient
from flask import current_app, json

import os
import uuid
from datetime import datetime, timezone
from flask import Flask, request, jsonify, make_response
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, OperationFailure
from werkzeug.utils import secure_filename # Aunque no usemos el nombre, sí el objeto file

class ImageModel:
    @staticmethod
    def get_db():
        mongo_uri = current_app.config.get("MONGO_URI")
        client = MongoClient(mongo_uri)
        db_name = mongo_uri.split("/")[-1]  # Extrae el nombre de la base de datos de la URI
        db = client[db_name]
        return db
    
    @staticmethod
    def saveImage(username, file):
        UPLOAD_FOLDER = 'uploads'
        # Generar ID único y nombre de archivo seguro
        file_id = str(uuid.uuid4())
        # Obtenemos la extensión original de forma segura
        filename = secure_filename(file.filename) # Limpia el nombre de archivo
        extension = filename.rsplit('.', 1)[1].lower()
        unique_filename = f"{file_id}.{extension}"
        save_path = os.path.join(UPLOAD_FOLDER, unique_filename)

        # Crear carpeta de uploads si no existe
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)

        # Guardar el archivo
        file.save(save_path)

        # Ruta relativa para guardar en DB (ajusta si sirves desde otra URL base)
        # Asumiendo que sirves la carpeta 'uploads' directamente
        db_path = os.path.join('uploads', unique_filename)
        # Si usas os.path.join en Windows, podría usar '\', forzar '/' si es para URL:
        db_path = db_path.replace(os.path.sep, '/')

        photo_metadata = {
            "_id": file_id, # Usamos el UUID como _id
            "filename": unique_filename,
            "path": db_path,
            "content_type": file.content_type, # Guardar el tipo MIME
            "uploaded_at": datetime.now(timezone.utc),
            "uploaded_by": username # Quién subió la foto
        }

        db = ImageModel.get_db()
        db["imagenes"].insert_one(photo_metadata)

        return file_id

    

    