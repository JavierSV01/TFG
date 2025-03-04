import datetime
from flask import jsonify, request, session
from . import association_bp
from .models import AssociationModel
from app.user.helpers import get_one_workout_for_user
from pymongo.errors import DuplicateKeyError
from bson.json_util import dumps


@association_bp.route('/addworkout', methods=['POST'])
def addworkout():
    """
    Agrega un entrenamiento a un cliente.
    ---
    tags:
      - Asociaciones
    consumes:
      - application/json
    parameters:
      - in: body
        name: body
        description: Datos del entrenamiento a agregar.
        required: true
        schema:
          type: object
          properties:
            cliente:
              type: string
              description: ID del cliente.
            id_workout:
              type: string
              description: ID del entrenamiento.
    responses:
      201:
        description: Entrenamiento agregado con éxito.
        schema:
          type: object
          properties:
            mensaje:
              type: string
              example: "Entrenamiento agregado con éxito"
      400:
        description: Error en la solicitud (datos faltantes, entrenamiento no existe, etc.).
        schema:
          type: object
          properties:
            mensaje:
              type: string
              examples:
                - "Faltan datos"
                - "El entrenamiento no existe"
                - "El entrenamiento ya fue agregado"
                - "El cliente no tiene asignado ese entrenador"
      401:
        description: Usuario no autenticado.
        schema:
          type: object
          properties:
            mensaje:
              type: string
              example: "Usuario no autenticado"
    """
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
    """
    Obtiene las asociaciones de un usuario (entrenador o cliente).
    ---
    tags:
      - Asociaciones
    responses:
      200:
        description: Lista de asociaciones del usuario.
        schema:
          type: object
          properties:
            associations:
              type: array
              items:
                type: object # Se deberia definir el esquema de la association si fuera necesario.
      401:
        description: Usuario no autenticado.
        schema:
          type: object
          properties:
            mensaje:
              type: string
              example: "Usuario no autenticado"
      404:
        description: No se encontraron asociaciones.
        schema:
          type: object
          properties:
            mensaje:
              type: string
              example: "No se encontraron asociaciones"
    """
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
    """
    Elimina un entrenamiento de un cliente.
    ---
    tags:
      - Asociaciones
    consumes:
      - application/json
    parameters:
      - in: body
        name: body
        description: Datos del entrenamiento a eliminar.
        required: true
        schema:
          type: object
          properties:
            cliente:
              type: string
              description: ID del cliente.
            id_workout:
              type: string
              description: ID del entrenamiento.
    responses:
      200:
        description: Entrenamiento eliminado con éxito.
        schema:
          type: object
          properties:
            mensaje:
              type: string
              example: "Entrenamiento eliminado con éxito"
      400:
        description: Error en la solicitud (datos faltantes, etc.).
        schema:
          type: object
          properties:
            mensaje:
              type: string
              example: "Faltan datos"
      401:
        description: Usuario no autenticado.
        schema:
          type: object
          properties:
            mensaje:
              type: string
              example: "Usuario no autenticado"
      404:
        description: Entrenamiento no encontrado o no asociado.
        schema:
          type: object
          properties:
            mensaje:
              type: string
              example: "El entrenamiento no existe o no está asociado"
    """
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
    
@association_bp.route('/updateworkout', methods=['PUT'])
def update_workout():
    """
    Actualiza un entrenamiento de un cliente.
    ---
    tags:
      - Asociaciones
    consumes:
      - application/json
    parameters:
      - in: body
        name: body
        description: Datos del entrenamiento a actualizar.
        required: true
        schema:
          type: object
          properties:
            idEntrenamiento:
              type: string
              description: ID del entrenamiento a actualizar.
            idEntrenador:
              type: string
              description: ID del entrenador.
            idUsuario:
              type: string
              description: ID del usuario(cliente).
            entrenamiento:
              type: object # TODO: definir el esquema de entrenamiento.
              description: Datos actualizados del entrenamiento.
            estado:
              type: string
              description: Estado del entrenamiento.
            semIndex:
              type: integer
              description: Indice de semana
            dayIndex:
              type: integer
              description: indice de dia
    responses:
      200:
        description: Entrenamiento actualizado con éxito.
        schema:
          type: object
          properties:
            mensaje:
              type: string
              example: "Entrenamiento actualizado con éxito"
      400:
        description: Datos incompletos o no se pudo actualizar el entrenamiento.
        schema:
          type: object
          properties:
            mensaje:
              type: string
              examples:
                - "Datos incompletos"
                - "No se pudo actualizar el entrenamiento"
    """
    data = request.json
    workout_id = data.get('idEntrenamiento')
    trainer_id = data.get('idEntrenador')
    user_id = data.get('idUsuario')
    workout = data.get('entrenamiento')
    status = data.get('estado')
    semIndex = data.get('semIndex')
    dayIndex = data.get('dayIndex')
    print(data)
    if not (workout_id, trainer_id and user_id and workout and status):
        return jsonify({"mensaje": "Datos incompletos"}), 400
    result = AssociationModel.updateWorkout(user_id, trainer_id, workout_id, workout, status, semIndex, dayIndex)
    if result.modified_count > 0:
        return jsonify({"mensaje": "Entrenamiento actualizado con éxito"}), 200
    return jsonify({"mensaje": "No se pudo actualizar el entrenamiento"}), 400