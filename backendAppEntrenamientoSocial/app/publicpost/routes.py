from . import post_bp
from flask import send_from_directory, session, jsonify, request
import datetime
from app.image.helpers import saveImage
from .models import PublicPostModel

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