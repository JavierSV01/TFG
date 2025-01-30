from flask import Blueprint, request, jsonify, session
from app import mongo, socketio # Importar mongo y socketio
from bson.objectid import ObjectId
from flask_socketio import join_room, leave_room, emit
from . import chat_bp
from .models import ChatModel

@socketio.on('join_room')
def handle_join_room(data):
    try:
        room = str(data['room']) # CONVERTIR A STRING AQUI
        join_room(room)
        emit('status', {'msg': "Alguien se ha unido"}, room=room)
    except Exception as e:
        print(f"Error en join_room: {e}")

@socketio.on('leave_room')
def handle_leave_room(data):
    try:
      room = str(data['room'])
      leave_room(room)
      emit('status', {'msg': "Alguien se ha ido"}, room=room)
    except Exception as e:
        print(f"Error en leave_room: {e}")

@socketio.on('send_message')
def handle_send_message(data):
    try:
        sender_id = data.get('username')
        chat_id = data.get('room')
        message = data.get('message')
        timestamp = data.get('timestamp')
        if not all([sender_id, chat_id, message, timestamp]):
            return jsonify({"error": "Faltan datos requeridos"}), 400

        message_data = {
            'username': sender_id,
            'mensaje': message,
            'fecha': timestamp
        }
        ChatModel.insert_message(chat_id, sender_id, message, timestamp)

        try:
            emit('new_message', message_data, room=chat_id) # Emitir a la sala
        except Exception as e:
            return jsonify({"error": str(e)}), 500

        return jsonify({"message": "Mensaje enviado"}), 200 # Respuesta exitosa

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@chat_bp.route('/exist', methods=['GET'])
def get_chat():
    try:
        
        user_id1 = request.args.get('id1')
        user_id2 = request.args.get('id2')
        if not user_id1 or not user_id2:
            return jsonify({"error": "Se requieren ambos IDs de usuario"}), 400

        if 'usuario' in session and session['usuario'] == user_id1:

            chat_id = ChatModel.get_chat_id(user_id1, user_id2)
            if not chat_id:
                return jsonify({"error": "No se encontró el chat"}), 404

            return jsonify({"chat_id": str(chat_id)})
        else:
            return "Acceso denegado", 403 # Código de estado 403 Forbidden
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@chat_bp.route('/getchat', methods=['GET'])
def get_chat_details():
    try:
        user_id = session.get('usuario')
        chat_id = request.args.get('chat_id')
        if not user_id or not chat_id:
            return jsonify({"error": "Faltan datos requeridos"}), 400
        chat_data = ChatModel.get_chat_by_id(chat_id)

        if not chat_data:
            return jsonify({"error": "No se encontró el chat"}), 404

        if user_id not in chat_data['usuarios']:
            return "Acceso denegado", 403

        # Convert any ObjectId to strings
        chat_data = {k: str(v) if isinstance(v, ObjectId) else v for k, v in chat_data.items()}
        return jsonify(chat_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


