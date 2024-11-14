from flask import Flask, request, jsonify,  session, redirect, url_for
from flask_cors import CORS
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from pymongo.errors import DuplicateKeyError
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv
from bson.json_util import dumps
import os
import datetime

load_dotenv()
app = Flask(__name__)

# Obtener las variables del entorno
host = os.getenv('BACKEND_HOST')
port = os.getenv('BACKEND_PORT')
print(host)
print(port)
app.secret_key = 'mysecretkey'

CORS(app, supports_credentials=True)  # Permitir solicitudes desde cualquier origen

# Configurar SameSite y Secure
app.config['SESSION_COOKIE_SAMESITE'] = 'None'  # Permite compartir cookies entre sitios
app.config['SESSION_COOKIE_SECURE'] = True      # Requiere HTTPS; usa False solo para desarrollo en HTTP

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

# Endpoint para obtener solo los usuarios con rol "entrenador"
@app.route('/api/usuarios/entrenadores', methods=['GET'])
def obtener_entrenadores():
    try:

        # Verificar si el usuario está autenticado
        if 'usuario' not in session:
            return jsonify({"error": "Usuario no autenticado"}), 401

        # Obtener el ID del usuario desde la sesión
        usuario = session['usuario']

        # Consulta para obtener solo los usuarios con rol "entrenador"
        entrenadores = db.find({"rol": "entrenador", "usuario": {"$ne": usuario}}, {"usuario":1, "presentacion":1})
        
        # Convierte el cursor de MongoDB a una lista de JSON
        entrenadores_list = list(entrenadores)
        
        # Utilizamos `dumps` de `bson.json_util` para serializar correctamente los datos de MongoDB
        return dumps(entrenadores_list), 200, {'Content-Type': 'application/json'}
    except Exception as e:
        print("Error al obtener entrenadores:", e)
        return jsonify({"message": "Error al obtener entrenadores"}), 500

# Endpoint para que un cliente haga una solicitud a un determinado entrenador
@app.route('/api/solicitudes', methods=['POST'])
def registrar_solicitud():
    try:
        # Verifica si hay una sesión activa y obtiene el clienteId desde la sesión
        usuarioSolicitante = session.get('usuario')  # El ID del cliente está almacenado en la sesión

        if not usuarioSolicitante:
            return jsonify({"message": "No hay sesión activa. Por favor, inicia sesión."}), 400

        # Obtener los datos enviados en el cuerpo de la solicitud
        data = request.get_json()

        # Verificar si ya existe una solicitud con el mismo usuarioCliente y usuarioEntrenador
        solicitud_existente = mongo.db.solicitudes.find_one(
            {"usuarioCliente": usuarioSolicitante, "usuarioEntrenador": data["usuarioEntrenador"]}
        )

        if not solicitud_existente:
            # Crear la solicitud con los datos del cliente y entrenador
            solicitud = {
                "usuarioCliente": usuarioSolicitante,  # El ID del cliente desde la sesión
                "usuarioEntrenador": data["usuarioEntrenador"],  # El ID del entrenador
                "mensaje": data["mensaje"],  # Mensaje enviado en la solicitud
                "fecha": datetime.datetime.now()  # Fecha actual de la solicitud
            }

            # Insertar la solicitud en la base de datos
            mongo.db.solicitudes.insert_one(solicitud)

        notificacion = {
            "_id": ObjectId(),
            "tipo": 1,
            "usuarioCliente": usuarioSolicitante,  # El ID del cliente desde la sesión
            "mensaje": data["mensaje"],  # Mensaje enviado en la solicitud
            "fecha": datetime.datetime.now()  # Fecha actual de la solicitud
        }

         # Agrega la notificacion al entrenador
        result = mongo.db.usuarios.update_one(
            {"usuario": data["usuarioEntrenador"]},
            {"$push": {"notificaciones": notificacion}}
        )

        
        if solicitud_existente:
            return jsonify({"mensaje": "Ya enviaste una solicitud a este entrenador. Se le ha vuelto a notificar"}), 200
        return jsonify({"mensaje": "Solicitud registrada con éxito"}), 200
    except Exception as e:
        print(e)
        return jsonify({"mensaje": f"Error al registrar la solicitud: {str(e)}"}), 500


@app.route('/api/solicitudes/entrenador', methods=['GET'])
def obtener_solicitudes_entrenador():
    try:
        # Verifica si hay una sesión activa y obtiene el usuario desde la sesión
        usuario = session.get('usuario')
        if not usuario:
            return jsonify({"message": "Usuario no autenticado"}), 401

        # Consulta la base de datos para obtener las solicitudes del entrenador
        solicitudes = mongo.db.solicitudes.find({"usuarioEntrenador": usuario})

        # Convierte las solicitudes a una lista de diccionarios
        solicitudes_list = list(solicitudes)

        for solicitud in solicitudes_list:
            solicitud['_id'] = str(solicitud['_id'])

        return jsonify(solicitudes_list), 200
    except Exception as e:
        print(e)
        return jsonify({"message": f"Error al obtener las solicitudes: {str(e)}"}), 500

# Endpoint para obtener las notificaciones del usuario con la sesion iniciada
@app.route('/api/notificaciones', methods=['GET'])
def obtener_notificaciones():
    # Verifica si hay una sesión activa y obtiene el clienteId desde la sesión
    usuario = session.get('usuario')  # El ID del cliente está almacenado en la sesión

    if not usuario:
        return jsonify({"message": "No hay sesión activa. Por favor, inicia sesión."}), 400
    
    # Buscar notificaciones del usuario específico
    # notiUsu = mongo.db.usuarios.find_one({"usuario": usuario}, {"notificaciones": 1})
    notiUsu = mongo.db.usuarios.find_one({"usuario": usuario}, {"notificaciones": 1})


    # Si el usuario no existe, devolver error
    if not notiUsu:
        return jsonify({'error': 'Usuario no encontrado'}), 404

    # Convertir el _id de cada notificación a un string
    notificaciones = notiUsu.get('notificaciones', [])
    for notificacion in notificaciones:
        notificacion['_id'] = str(notificacion['_id']) 

    # Devolver solo las notificaciones del usuario
    return jsonify({'notificaciones': notificaciones}), 200


# Endpoint para aceptar asesoramiento y crear una asociación
@app.route('/api/aceptar_asesoramiento', methods=['POST'])
def aceptar_asesoramiento():
    data = request.json
    print(data)
    usuarioCliente = data.get('usuarioCliente')
    usuarioEntrenador = data.get('usuarioEntrenador')

    if not usuarioCliente or not usuarioEntrenador:
        return jsonify({'error': 'Faltan datos del cliente o entrenador'}), 400

    # Verificar si ya existe una asociación activa entre este cliente y entrenador
    asociacion_activa = mongo.db.asesoramientos.find_one({
        'usuarioCliente': usuarioCliente,
        'usuarioEntrenador': usuarioEntrenador,
        'estado': 1
    })

    if asociacion_activa:
        return jsonify({'error': 'Ya estas asesorando a este cliente'}), 200

    # Crear la asociación entre cliente y entrenador en la colección "asociaciones"
    nueva_asociacion = {
        'usuarioCliente': usuarioCliente,
        'usuarioEntrenador': usuarioEntrenador,
        'estado': 1,
        'fecha_asociacion': datetime.datetime.now()
    }
    mongo.db.asesoramientos.insert_one(nueva_asociacion)
    
    # Borramos la soliciud de la coleccion una vez aceptada
    mongo.db.solicitudes.delete_one({
        "usuarioCliente": usuarioCliente,
        "usuarioEntrenador": usuarioEntrenador
    })

    return jsonify({'message': 'Asociación creada exitosamente'}), 201


if __name__ == '__main__':
    app.run(host=host, port=port)