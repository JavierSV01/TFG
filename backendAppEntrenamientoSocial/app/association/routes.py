import datetime
from flask import jsonify, request, session
from . import association_bp
from .models import AssociationModel
from app.user.helpers import get_one_workout_for_user
from pymongo.errors import DuplicateKeyError

@association_bp.route('/addworkout', methods=['POST'])
def addworkout():
    if 'usuario' in session: 
        usuario = session['usuario']
    data = request.json

    id_cliente = data.get('cliente')
    id_entrenador = session['usuario']
    id_workout = data.get('id_workout')
    
    date = datetime.datetime.now()

    if id_cliente and id_entrenador and id_workout:
        if(AssociationModel.existAssociation(id_cliente, id_entrenador)):
            entrenamiento = get_one_workout_for_user(id_entrenador, id_workout)
            if entrenamiento is None:
                return jsonify({"mensaje": "El entrenamiento no existe"}), 400
            try:
                AssociationModel.insert_workout(id_cliente, id_entrenador, entrenamiento, date)
                return jsonify({"mensaje": "Entrenamiento agregado con éxito"}), 201
            except DuplicateKeyError:
                return jsonify({"mensaje": "El entrenamiento ya fue agregado"}), 400
        else:
            return jsonify({"mensaje": "El cliente no tiene asignado ese entrenador"}), 400
        
    else:
        return jsonify({"mensaje": "Faltan datos"}), 400