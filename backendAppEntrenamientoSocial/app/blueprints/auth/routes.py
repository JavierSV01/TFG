from flask import Blueprint, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash
from .models import UserModel
from pymongo.errors import DuplicateKeyError

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')


# Ruta para registrar un nuevo usuario
@auth_bp.route('/register', methods=['POST'])
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
@auth_bp.route('/login', methods=['POST'])
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
@auth_bp.route('/status', methods=['GET'])
def status():
#    if 'user_id' not in session:
#        return jsonify({"logged_in": False}), 200
#    return jsonify({"logged_in": True, "user_id": session['user_id']}), 200
    if 'usuario' in session:  # Verificar si hay una sesión activa
        usuario = session['usuario']
        return jsonify({"mensaje": f"Bienvenido al dashboard, {usuario}"}), 200
    else:
        return jsonify({"mensaje": "Acceso denegado. Inicia sesión primero."}), 401

# Ruta para cerrar sesión
@auth_bp.route('/logout', methods=['POST'])
def logout():
    session.pop('usuario', None)  # Eliminar el usuario de la sesión
    return jsonify({"mensaje": "Sesión cerrada"}), 200
