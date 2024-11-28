from flask import Blueprint, request, jsonify, session
from bson.json_util import dumps
from werkzeug.security import generate_password_hash, check_password_hash
from .models import SolicitudeModel
from bson.objectid import ObjectId
from . import solicitude_bp
import datetime
from app.association.helpers import existAssociation
from app.user.helpers import insert_notification_for_user
from app.association.helpers import insertAssociation


@solicitude_bp.route('/mysolicitude', methods=['GET'])
def solicitude():
    try:
        usuario = session.get('usuario')
        if not usuario:
            return jsonify({"message": "Usuario no autenticado"}), 401

        solicitudes = SolicitudeModel.get_solicitude(usuario)

        solicitudes_list = list(solicitudes)

        for solicitud in solicitudes_list:
            solicitud['_id'] = str(solicitud['_id'])

        return jsonify(solicitudes_list), 200
    except Exception as e:
        print(e)
        return jsonify({"message": f"Error al obtener las solicitudes: {str(e)}"}), 500


@solicitude_bp.route('/apply', methods=['POST'])
def apply():
    try:
        usuarioSolicitante = session.get('usuario') 
        if not usuarioSolicitante:
            return jsonify({"message": "No hay sesión activa. Por favor, inicia sesión."}), 400

        data = request.get_json()

        solicitud_existente = SolicitudeModel.get_one_solicitude(usuarioSolicitante, data["usuarioEntrenador"])
        
        existAsso = existAssociation(usuarioSolicitante, data["usuarioEntrenador"])

        if not solicitud_existente and not existAsso:
            solicitud = {
                "usuarioCliente": usuarioSolicitante, 
                "usuarioEntrenador": data["usuarioEntrenador"], 
                "mensaje": data["mensaje"],
                "fecha": datetime.datetime.now() 
            }

            SolicitudeModel.insert_solicitude(solicitud)

        if not existAsso:
            notificacion = {
                "_id": ObjectId(),
                "tipo": 1,
                "usuarioCliente": usuarioSolicitante, 
                "mensaje": data["mensaje"], 
                "fecha": datetime.datetime.now() 
            }
            result = insert_notification_for_user(data["usuarioEntrenador"], notificacion)

        if existAsso:
            return jsonify({"mensaje": "Ya estas siendo asesorado por a " + data["usuarioEntrenador"]}), 200
        
        if solicitud_existente:
            return jsonify({"mensaje": "Ya enviaste una solicitud a este entrenador. Se le ha vuelto a notificar"}), 200
        return jsonify({"mensaje": "Solicitud registrada con éxito"}), 200
    except Exception as e:
        print(e)
        return jsonify({"mensaje": f"Error al registrar la solicitud: {str(e)}"}), 500

# Endpoint para aceptar asesoramiento y crear una asociación
@solicitude_bp.route('/accept', methods=['POST'])
def aceptar_asesoramiento():
    data = request.json
    usuarioCliente = data.get('usuarioCliente')
    usuarioEntrenador = data.get('usuarioEntrenador')

    if not usuarioCliente or not usuarioEntrenador:
        return jsonify({'error': 'Faltan datos del cliente o entrenador'}), 400

    existAsso = existAssociation(usuarioCliente, usuarioEntrenador)


    if existAsso:
        return jsonify({'error': 'Ya estas asesorando a este cliente'}), 200

    # Crear la asociación entre cliente y entrenador en la colección "asociaciones"
    nueva_asociacion = {
        'usuarioCliente': usuarioCliente,
        'usuarioEntrenador': usuarioEntrenador,
        'estado': 1,
        'fecha_asociacion': datetime.datetime.now()
    }
    insertAssociation(nueva_asociacion)
    
    SolicitudeModel.delete_solicitude(usuarioCliente, usuarioEntrenador)

    return jsonify({'message': 'Asociación creada exitosamente'}), 201

