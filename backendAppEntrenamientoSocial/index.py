from flask import Flask, request, jsonify,  session, redirect, url_for
from flask_cors import CORS
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from pymongo.errors import DuplicateKeyError
from werkzeug.security import generate_password_hash, check_password_hash


app = Flask(__name__)


app.secret_key = 'mysecretkey'

CORS(app, supports_credentials=True)  # Permitir solicitudes desde cualquier origen

# Conectar a la base de datos 'appEntrenamiento'
app.config["MONGO_URI"] = "mongodb://localhost:27017/appEntrenamiento"  # Cambia a tu URI si usas MongoDB en la nube
mongo = PyMongo(app)

# Acceder a la colección 'usuarios'
db = mongo.db.usuarios

# Crear el índice único en el campo 'usuario'
mongo.db.usuarios.create_index([('usuario', 1)], unique=True)


# Ruta para insertar un nuevo usuario con un ID único y contraseña encriptada
@app.route('/registro', methods=['POST'])
def add_user():
    data = request.json
    usuario = data.get('usuario')
    password = data.get('contrasenia')
    rol = data.get('rol')

    password_encrypted = generate_password_hash(password)
    if usuario and password:
        try:
            # Intentar insertar el nuevo usuario
            mongo.db.usuarios.insert_one({'usuario': usuario, 'contrasenia': password_encrypted, 'rol': rol})
            return jsonify({"mensaje": "Usuario agregado con éxito"}), 201
        except DuplicateKeyError:
            # Manejar el error si el usuario ya existe
            return jsonify({"mensaje": "El nombre de usuario ya existe"}), 400
    else:
        return jsonify({"mensaje": "Faltan datos"}), 400

@app.route('/')
def home():
    return "¡Hola, mundo!"


# Endpoint para validar credenciales
@app.route('/login', methods=['POST'])
def login():
    datos = request.json  # Obtener datos enviados en formato JSON
    username = datos.get('usuario')
    password = datos.get('contrasenia')

    if username and password:
        user = db.find_one({'usuario': username})
        if user and check_password_hash(user['contrasenia'], password):
            session.permanent = True
            session['usuario'] = username
            return jsonify({"mensaje": "Inicio de sesión exitoso"}), 200
        else:
            return jsonify({"mensaje": "Credenciales incorrectas"}), 401
    else:
        return jsonify({"mensaje": "Faltan datos"}), 400


@app.route('/isLogin')
def dashboard():
    if 'usuario' in session:  # Verificar si hay una sesión activa
        usuario = session['usuario']
        return jsonify({"mensaje": f"Bienvenido al dashboard, {usuario}"}), 200
    else:
        return jsonify({"mensaje": "Acceso denegado. Inicia sesión primero."}), 401

@app.route('/logout')
def logout():
    session.pop('usuario', None)  # Eliminar el usuario de la sesión
    return jsonify({"mensaje": "Sesión cerrada"}), 200

@app.route('/entrenamiento', methods=['POST'])
def save_entrenamiento():
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

    # Agregar el entrenamiento en el array 'entrenamientos' del usuario
    result = mongo.db.usuarios.update_one(
        {"usuario": usuario},
        {"$push": {"entrenamientos": entrenamiento}}
    )

    if result.modified_count > 0:
        return jsonify({"message": "Entrenamiento guardado exitosamente"}), 201
    else:
        return jsonify({"error": "No se pudo guardar el entrenamiento"}), 500

# Endpoint para obtener el rol del usuario autenticado
@app.route('/user-role', methods=['GET'])
def obtener_rol():
    # Verificar si el usuario está autenticado
    if 'usuario' not in session:
        return jsonify({"error": "Usuario no autenticado"}), 401

    # Obtener el ID del usuario desde la sesión
    usuario = session['usuario']

    # Buscar el rol del usuario en la base de datos
    usuario = mongo.db.usuarios.find_one({"usuario": usuario}, {"rol": 1})
    
    if usuario and 'rol' in usuario:
        return jsonify({"role": usuario['rol']}), 200
    else:
        return jsonify({"error": "Rol no encontrado para el usuario"}), 404

if __name__ == '__main__':
    app.run(port=3001)