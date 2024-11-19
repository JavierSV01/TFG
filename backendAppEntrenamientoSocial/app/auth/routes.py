from flask import Blueprint, request, jsonify, session
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from .models import UserModel
from pymongo.errors import DuplicateKeyError
from . import auth_bp

# Ruta para registrar un nuevo usuario
@auth_bp.route('/', methods=['POST'])
def basico():
    return "<h1>Hola Mundo</h1>"

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
    if 'usuario' in session: 
        usuario = session['usuario']
        return jsonify({"mensaje": f"Bienvenido al dashboard, {usuario}"}), 200
    else:
        return jsonify({"mensaje": "Acceso denegado. Inicia sesión primero."}), 401

# Ruta para cerrar sesión
@auth_bp.route('/logout', methods=['POST'])
def logout():
    session.pop('usuario', None)  # Eliminar el usuario de la sesión
    return jsonify({"mensaje": "Sesión cerrada"}), 200
