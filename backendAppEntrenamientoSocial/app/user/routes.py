from flask import Blueprint, request, jsonify, session
from bson.json_util import dumps
from werkzeug.security import generate_password_hash, check_password_hash
from .models import UserModel
from pymongo.errors import DuplicateKeyError
from . import user_bp
from app.association.helpers import getClientsByTrainer
from app.association.helpers import getAssociationByUser

# Ruta para registrar un nuevo usuario
@user_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    usuario = data.get('usuario')
    password = data.get('contrasenia')
    rol = data.get('rol')

    password_encrypted = generate_password_hash(password)
    if usuario and password:
        try:
            # Intentar insertar el nuevo usuario
            UserModel.insert_user(usuario, password_encrypted, rol)
            return jsonify({"mensaje": "Usuario agregado con éxito"}), 201
        except DuplicateKeyError:
            # Manejar el error si el usuario ya existe
            return jsonify({"mensaje": "El nombre de usuario ya existe"}), 400
    else:
        return jsonify({"mensaje": "Faltan datos"}), 400
    

# Ruta para iniciar sesión
@user_bp.route('/login', methods=['POST'])
def login():
    datos = request.json  # Obtener datos enviados en formato JSON
    username = datos.get('usuario')
    password = datos.get('contrasenia')

    if username and password:
        user = UserModel.find_by_username(username)
        if user and check_password_hash(user['contrasenia'], password):
            session.permanent = True
            session['usuario'] = username
            return jsonify({"mensaje": "Inicio de sesión exitoso"}), 200
        else:
            return jsonify({"mensaje": "Credenciales incorrectas"}), 401
    else:
        return jsonify({"mensaje": "Faltan datos"}), 400
    

# Ruta para comprobar si el usuario está logueado
@user_bp.route('/status', methods=['GET'])
def status():
    if 'usuario' in session: 
        usuario = session['usuario']
        return jsonify({"mensaje": f"Bienvenido al dashboard, {usuario}"}), 200
    else:
        return jsonify({"mensaje": "Acceso denegado. Inicia sesión primero."}), 401

# Ruta para cerrar sesión
@user_bp.route('/logout', methods=['POST'])
def logout():
    session.pop('usuario', None)  # Eliminar el usuario de la sesión
    return jsonify({"mensaje": "Sesión cerrada"}), 200


# Endpoint para obtener el rol del usuario autenticado
@user_bp.route('/role', methods=['GET'])
def obtener_rol():
    # Verificar si el usuario está autenticado
    if 'usuario' not in session:
        return jsonify({"error": "Usuario no autenticado"}), 401

    # Obtener el ID del usuario desde la sesión
    usuario = session['usuario']

    # Buscar el rol del usuario en la base de datos
    usuario_rol =  UserModel.get_role(usuario)
    if usuario and 'rol' in usuario_rol:
        return jsonify({"role": usuario_rol['rol']}), 200
    else:
        return jsonify({"error": "Rol no encontrado para el usuario"}), 401


# Endpoint para obtener solo los usuarios con rol "entrenador"
@user_bp.route('/trainers', methods=['GET'])
def obtener_entrenadores():
    try:

        # Verificar si el usuario está autenticado
        if 'usuario' not in session:
            return jsonify({"error": "Usuario no autenticado"}), 401

        # Obtener el ID del usuario desde la sesión
        usuario = session['usuario']

        # Consulta para obtener solo los usuarios con rol "entrenador"
        entrenadores = UserModel.get_trainers(usuario)
        # Convierte el cursor de MongoDB a una lista de JSON
        entrenadores_list = list(entrenadores)
        
        # Utilizamos `dumps` de `bson.json_util` para serializar correctamente los datos de MongoDB
        return dumps(entrenadores_list), 200, {'Content-Type': 'application/json'}
    except Exception as e:
        return jsonify({"message": "Error al obtener entrenadores"}), 500
    

@user_bp.route('/workouts', methods=['GET'])
def get_workouts():
    if 'usuario' not in session:
        return jsonify({"error": "Usuario no autenticado"}), 401
    usuario = session['usuario']
    try:
        entrenamientos = UserModel.get_workouts_for_user(usuario)
        return dumps(entrenamientos), 200, {'Content-Type': 'application/json'}
    except Exception:
        return jsonify({"message": "Error al obtener entrenamientos"}), 500
    



@user_bp.route('/workout', methods=['POST'])
def save_workout():
    # Verificar que el usuario esté logueado
    if 'usuario' not in session:
        return jsonify({"error": "Usuario no autenticado"}), 401

    # Obtener el ID del usuario desde la sesión
    usuario = session['usuario']

    data = request.json
    title = data.get('title', 'Entrenamiento sin título')
    description = data.get('description', 'Sin descripción')
    weeks = data.get('weeks', [])

    # Crear el entrenamiento con un ID único
    entrenamiento = {
        "title": title,
        "description": description,
        "weeks": weeks
    }

    result = UserModel.insert_workout_for_user(usuario, entrenamiento)


    if result.modified_count > 0:
        return jsonify({"message": "Entrenamiento guardado exitosamente"}), 201
    else:
        return jsonify({"error": "No se pudo guardar el entrenamiento"}), 500
    
# Endpoint para obtener todos los clientes del entrenador logueado
@user_bp.route('/clients', methods=['GET'])
def obtener_clientes():
    # Verificar que el usuario esté logueado
    if 'usuario' not in session:
        return jsonify({"error": "Usuario no autenticado"}), 401

    # Obtener el ID del usuario desde la sesión
    usuario = session['usuario']

    try:
        # Obtener los clientes del entrenador logueado
        clientes = getClientsByTrainer(usuario)
        # Convertir el cursor de MongoDB a una lista de JSON
        clientes_list = list(clientes)
        
        # Utilizamos `dumps` de `bson.json_util` para serializar correctamente los datos de MongoDB
        return dumps(clientes_list), 200, {'Content-Type': 'application/json'}
    except Exception as e:
        return jsonify({"message": "Error al obtener clientes"}), 500
    

@user_bp.route('/allinfo', methods=['POST'])
def obtener_usuario():

    data = request.json
    usuarioCliente = data.get('usuario')
    try:
        # Obtener la información del usuario
        usuario_info = UserModel.find_by_username(usuarioCliente)
        if not usuario_info:
            return jsonify({"error": "Usuario no encontrado"}), 404

        
        # Obtener la información de las asociaciones del usuario
        asociaciones = getAssociationByUser(usuarioCliente)
        asociaciones_list = list(asociaciones)
        # Combinar la información del usuario con las asociaciones
        usuario_info['asociaciones'] = asociaciones_list

        # Utilizamos `dumps` de `bson.json_util` para serializar correctamente los datos de MongoDB
        return dumps(usuario_info), 200, {'Content-Type': 'application/json'}
    except Exception as e:
        return jsonify({"message": "Error al obtener la información del usuario"}), 500


@user_bp.route('/username', methods=['GET'])
def obtener_nombre_usuario():
    if 'usuario' not in session:
        return jsonify({"error": "Usuario no autenticado"}), 401
    usuario = session['usuario']
    return jsonify({"usuario": usuario}), 200

@user_bp.route('/data', methods=['POST'])
def save_data():
    # Verificar que el usuario esté logueado
    if 'usuario' not in session:
        return jsonify({"error": "Usuario no autenticado"}), 401

    # Obtener el ID del usuario desde la sesión
    usuario = session['usuario']

    data = request.json

    try:
        result = UserModel.update_data_for_user(usuario, data)
        if result > 0:
            return jsonify({"message": "Datos guardados exitosamente"}), 201
        else:
            return jsonify({"error": "No se pudo guardar los datos"}), 500
    except Exception as e:
        return jsonify({"message": "Error al guardar los datos"}), 500

@user_bp.route('/clientinfo', methods=['POST'])
def obtener_info_cliente():
    # Verificar que el usuario esté logueado
    if 'usuario' not in session:
        return jsonify({"error": "Usuario no autenticado"}), 401

    # Obtener el ID del usuario desde la sesión
    usuario = session['usuario']

    data = request.json
    usuarioCliente = data.get('usuario')
    
    try:

        # Obtener la información del cliente
        cliente_info = UserModel.find_by_username(usuarioCliente)
        if not cliente_info:
            return jsonify({"error": "Usuario no encontrado"}), 404

        # Filtrar la información que el entrenador puede ver
        info_permitida = {
            "usuario": cliente_info.get("usuario"),
            "datos": cliente_info.get("datos")
        }

        asociaciones = getAssociationByUser(usuarioCliente)
        asociaciones = [asociacion for asociacion in asociaciones if asociacion.get('usuarioEntrenador') == usuario]
        asociaciones_list = list(asociaciones)
        # Combinar la información del usuario con las asociaciones
        info_permitida['asociacion'] = asociaciones_list

        # Utilizamos `dumps` de `bson.json_util` para serializar correctamente los datos de MongoDB
        return dumps(info_permitida), 200, {'Content-Type': 'application/json'}
    except Exception as e:
        return jsonify({"message": "Error al obtener la información del cliente"}), 500