from . import post_bp
from flask import send_from_directory, session, jsonify, request
import datetime
from app.image.helpers import saveImage
from .models import PublicPostModel

from pymongo import DESCENDING
from bson import ObjectId # Para manejar el _id de MongoDB
import math # Para calcular el total de páginas

def serialize_doc(doc):
    """Convierte ObjectId a string en un documento."""
    if doc and '_id' in doc and isinstance(doc['_id'], ObjectId):
        doc['_id'] = str(doc['_id'])
    # Puedes añadir conversiones para otros tipos si es necesario (ej. fechas a ISO string)
    # if 'fecha' in doc and isinstance(doc['fecha'], datetime):
    #     doc['fecha'] = doc['fecha'].isoformat()
    return doc

@post_bp.route('/publish', methods=['POST'])
def publish():
    try:

        if 'usuario' not in session: 
            return jsonify({"mensaje": "Usuario no autenticado"}), 401
            
        usuario = session['usuario']

        
        
        foto = request.files['foto']
        texto = request.form.get('text')
        tipo = request.form.get('tipo')

        imageId = saveImage(usuario, foto)
        date = datetime.datetime.now()

        PublicPostModel.public_post(usuario, imageId, texto, tipo, date)

        return jsonify({"mensaje": "Dieta agregado con éxito"}), 201
    
    except Exception as e:
        print(f"Error al publicar: {e}")
        return jsonify({"mensaje": "Ocurrió un error al procesar la publicación"}), 500
    
@post_bp.route('/posts', methods=['GET'])
def posts():
    try:
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 10))
    except ValueError:
        return jsonify({"error": "Parámetros 'page' y 'limit' deben ser números enteros."}), 400

    if page < 1 or limit < 1:
        return jsonify({"error": "Parámetros 'page' y 'limit' deben ser mayores que 0."}), 400

    skip = (page - 1) * limit

    try:
        total_posts = PublicPostModel.get_total_post()

        # 2. Obtener los documentos para la página actual
        #    - find({}) para obtener todos (puedes añadir un filtro aquí: find({'activo': True}))
        #    - sort('fecha', DESCENDING) para ordenar por fecha, más recientes primero
        #    - skip(skip) para saltar los documentos de páginas anteriores
        #    - limit(limit) para obtener solo los de esta página
        posts_cursor = PublicPostModel.get_paginated_posts(limit, skip)

        posts_list = [serialize_doc(doc) for doc in posts_cursor]

        total_pages = math.ceil(total_posts / limit) # Redondear hacia arriba
        has_next_page = page < total_pages

        response_data = {
            "posts": posts_list, 
            "currentPage": page,
            "totalPages": total_pages,
            "totalPosts": total_posts,
            "hasNextPage": has_next_page,
            # Podrías añadir "limit": limit si el frontend lo necesita
        }

        return jsonify(response_data), 200

    except Exception as e:
        print(f"Error durante la consulta a la base de datos: {e}")
        return jsonify({"error": f"Error interno del servidor: {e}"}), 500
