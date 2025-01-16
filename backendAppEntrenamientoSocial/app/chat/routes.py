from flask import Blueprint, request, jsonify, session
from app import mongo, socketio # Importar mongo y socketio
from bson.objectid import ObjectId
from flask_socketio import join_room, leave_room, emit
from . import chat_bp
from .models import ChatModel

@socketio.on('join_room') # Evento para unirse a una sala (grupo o usuario)
def handle_join_room(data):
    room = data['room']
    join_room(room)
    emit('status', {'msg': f"{data['username']} se ha unido a {room}"}, room=room)

@socketio.on('leave_room') # Evento para salir de una sala
def handle_leave_room(data):
    room = data['room']
    leave_room(room)
    emit('status', {'msg': f"{data['username']} ha abandonado {room}"}, room=room)

@chat_bp.route('/exist/<id1>/<id2>', methods=['GET'])
def get_chat():
    try:
        
        user_id1 = request.args.get('id1')
        user_id2 = request.args.get('id2')

        if 'usuario' in session and session['usuario'] == user_id1:
            if not user_id1 or not user_id2:
                return jsonify({"error": "Se requieren ambos IDs de usuario"}), 400
            chat_id = ChatModel.get_chat_id(user_id1, user_id2)
            if not chat_id:
                return jsonify({"error": "No se encontró el chat"}), 404

            return jsonify({"chat_id": str(chat_id)})
        else:
            return "Acceso denegado", 403 # Código de estado 403 Forbidden
        

        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
@chat_bp.route('/send', methods=['POST'])
def send_message():
    try:
        data = request.get_json()
        sender_id = data.get('sender_id')
        receiver_id = data.get('receiver_id')
        message = data.get('message')
        room = data.get('room')

        if not all([sender_id, receiver_id, message, room]):
            return jsonify({"error": "Faltan datos requeridos"}), 400

        result = ChatModel.insert_one()

        emit('new_message', { 
            '_id': str(result.inserted_id),
            'sender_id': sender_id,
            'receiver_id': receiver_id,
            'message': message,
            'timestamp': chat_message.timestamp.isoformat()
        }, room=room)

        return jsonify({"message": "Mensaje enviado", "inserted_id": str(result.inserted_id)}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500
