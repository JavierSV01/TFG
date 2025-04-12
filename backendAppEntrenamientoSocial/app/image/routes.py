from . import image_bp
from flask import send_from_directory, request
import os
import glob

@image_bp.route('/img', methods=['GET'])
def image():
    image_id = request.args.get('id')  # ejemplo: 'foto'
    UPLOAD_FOLDER = os.path.abspath('uploads')  # ruta absoluta

    # Buscar archivos que empiecen por el id y tengan cualquier extensión
    pattern = os.path.join(UPLOAD_FOLDER, f"{image_id}.*")
    matching_files = glob.glob(pattern)

    if not matching_files:
        return "Imagen no encontrada", 404

    # Tomamos el primer archivo que coincida
    file_path = matching_files[0]
    filename = os.path.basename(file_path)

    return send_from_directory(UPLOAD_FOLDER, filename)