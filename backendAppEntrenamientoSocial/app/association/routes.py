import datetime
from flask import jsonify, request, session
from . import association_bp
from .models import AssociationModel
from app.user.helpers import get_one_workout_for_user
from pymongo.errors import DuplicateKeyError
from bson.json_util import dumps


@association_bp.route('/addworkout', methods=['POST'])
def addworkout():
    if 'usuario' in session: 
        usuario = session['usuario']
    else:
        return jsonify({"mensaje": "Usuario no autenticado"}), 401
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
                AssociationModel.insertWorkout(id_cliente, id_entrenador, entrenamiento, date)
                return jsonify({"mensaje": "Entrenamiento agregado con éxito"}), 201
            except DuplicateKeyError:
                return jsonify({"mensaje": "El entrenamiento ya fue agregado"}), 400
        else:
            return jsonify({"mensaje": "El cliente no tiene asignado ese entrenador"}), 400
        
    else:
        return jsonify({"mensaje": "Faltan datos"}), 400
    
@association_bp.route('/myassociations', methods=['GET'])
def get_associations():
    if 'usuario' in session:
        usuario = session['usuario']
    else:
        return jsonify({"mensaje": "Usuario no autenticado"}), 401

    associations = AssociationModel.getAssociationByUser(usuario)
    if associations:
        return dumps({"associations": associations}), 200
    else:
        return jsonify({"mensaje": "No se encontraron asociaciones"}), 404
    
@association_bp.route('/removeworkout', methods=['DELETE'])
def removeworkout():
    if 'usuario' in session:
        usuario = session['usuario']
    else:
        return jsonify({"mensaje": "Usuario no autenticado"}), 401

    data = request.json
    id_cliente = data.get('cliente')
    id_entrenador = session['usuario']
    id_workout = data.get('id_workout')

    if id_cliente and id_entrenador and id_workout:
        if AssociationModel.existAssociation(id_cliente, id_entrenador):
            result = AssociationModel.removeWorkout(id_cliente, id_entrenador, id_workout)
            if result.modified_count > 0:
                return jsonify({"mensaje": "Entrenamiento eliminado con éxito"}), 200
            else:
                return jsonify({"mensaje": "El entrenamiento no existe o no está asociado"}), 404
        else:
            return jsonify({"mensaje": "El cliente no tiene asignado ese entrenador"}), 400
    else:
        return jsonify({"mensaje": "Faltan datos"}), 400