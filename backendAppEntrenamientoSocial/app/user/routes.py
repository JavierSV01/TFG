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
    """
    Registra un nuevo usuario.
    ---
    tags:
      - Usuarios
    consumes:
      - application/json
    parameters:
      - in: body
        name: body
        description: Datos del usuario a registrar.
        required: true
        schema:
          type: object
          properties:
            usuario:
              type: string
              description: Nombre de usuario.
            contrasenia:
              type: string
              description: Contraseña del usuario.
            rol:
              type: string
              description: Rol del usuario (entrenador, cliente, etc.).
    responses:
      201:
        description: Usuario agregado con éxito.
        schema:
          type: object
          properties:
            mensaje:
              type: string
              example: "Usuario agregado con éxito"
      400:
        description: Error en la solicitud (datos faltantes, usuario ya existe).
        schema:
          type: object
          properties:
            mensaje:
              type: string
              examples:
                - "Faltan datos"
                - "El nombre de usuario ya existe"
    """
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
    """
    Inicia sesión de un usuario.
    ---
    tags:
      - Usuarios
    consumes:
      - application/json
    parameters:
      - in: body
        name: body
        description: Datos de inicio de sesión.
        required: true
        schema:
          type: object
          properties:
            usuario:
              type: string
              description: Nombre de usuario.
            contrasenia:
              type: string
              description: Contraseña del usuario.
    responses:
      200:
        description: Inicio de sesión exitoso.
        schema:
          type: object
          properties:
            mensaje:
              type: string
              example: "Inicio de sesión exitoso"
      401:
        description: Credenciales incorrectas.
        schema:
          type: object
          properties:
            mensaje:
              type: string
              example: "Credenciales incorrectas"
      400:
        description: Faltan datos.
        schema:
          type: object
          properties:
            mensaje:
              type: string
              example: "Faltan datos"
    """
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
    """
    Verifica el estado de la sesión del usuario.
    ---
    tags:
      - Usuarios
    responses:
      200:
        description: Usuario autenticado.
        schema:
          type: object
          properties:
            mensaje:
              type: string
              example: "Bienvenido al dashboard, ..."
      401:
        description: Usuario no autenticado.
        schema:
          type: object
          properties:
            mensaje:
              type: string
              example: "Acceso denegado. Inicia sesión primero."
    """
    if 'usuario' in session: 
        usuario = session['usuario']
        return jsonify({"mensaje": f"Bienvenido al dashboard, {usuario}"}), 200
    else:
        return jsonify({"mensaje": "Acceso denegado. Inicia sesión primero."}), 401

# Ruta para cerrar sesión
@user_bp.route('/logout', methods=['POST'])
def logout():
    """
    Cierra la sesión del usuario.
    ---
    tags:
      - Usuarios
    responses:
      200:
        description: Sesión cerrada.
        schema:
          type: object
          properties:
            mensaje:
              type: string
              example: "Sesión cerrada"
    """
    session.pop('usuario', None)  # Eliminar el usuario de la sesión
    return jsonify({"mensaje": "Sesión cerrada"}), 200


# Endpoint para obtener el rol del usuario autenticado
@user_bp.route('/role', methods=['GET'])
def obtener_rol():
    """
    Obtiene el rol del usuario autenticado.
    ---
    tags:
      - Usuarios
    responses:
      200:
        description: Rol del usuario.
        schema:
          type: object
          properties:
            role:
              type: string
      401:
        description: Usuario no autenticado o rol no encontrado.
        schema:
          type: object
          properties:
            error:
              type: string
              examples:
                - "Usuario no autenticado"
                - "Rol no encontrado para el usuario"
    """
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
    """
    Obtiene la lista de entrenadores.
    ---
    tags:
      - Usuarios
    responses:
      200:
        description: Lista de entrenadores.
        schema:
          type: array
          items:
            type: object # Se deberia definir el esquema del entrenador si fuera necesario.
      401:
        description: Usuario no autenticado.
        schema:
          type: object
          properties:
            error:
              type: string
              example: "Usuario no autenticado"
      500:
        description: Error interno del servidor.
        schema:
          type: object
          properties:
            message:
              type: string
              example: "Error al obtener entrenadores"
    """
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
    """
    Obtiene los entrenamientos de un usuario.
    ---
    tags:
      - Usuarios
    responses:
      200:
        description: Lista de entrenamientos del usuario.
        schema:
          type: array
          items:
            type: object # Se deberia definir el esquema del entrenamiento si fuera necesario.
      401:
        description: Usuario no autenticado.
        schema:
          type: object
          properties:
            error:
              type: string
              example: "Usuario no autenticado"
      500:
        description: Error interno del servidor.
        schema:
          type: object
          properties:
            message:
              type: string
              example: "Error al obtener entrenamientos"
    """
    if 'usuario' not in session:
        return jsonify({"error": "Usuario no autenticado"}), 401
    usuario = session['usuario']
    try:
        entrenamientos = UserModel.get_workouts_for_user(usuario)
        entrenamientos_list = list(entrenamientos)
        return dumps(entrenamientos_list), 200, {'Content-Type': 'application/json'}
    except Exception:
        return jsonify({"message": "Error al obtener entrenamientos"}), 500

@user_bp.route('/workout', methods=['POST'])
def save_workout():

    """
    Guarda un nuevo entrenamiento para el usuario.
    ---
    tags:
      - Usuarios
    consumes:
      - application/json
    parameters:
      - in: body
        name: body
        description: Datos del entrenamiento a guardar.
        required: true
        schema:
          type: object
          properties:
            title:
              type: string
              description: Título del entrenamiento.
            description:
              type: string
              description: Descripción del entrenamiento.
            weeks:
              type: array
              items:
                type: object # Se deberia definir el esquema de la semana si fuera necesario.
              description: Semanas del entrenamiento.
    responses:
      201:
        description: Entrenamiento guardado exitosamente.
        schema:
          type: object
          properties:
            message:
              type: string
              example: "Entrenamiento guardado exitosamente"
      401:
        description: Usuario no autenticado.
        schema:
          type: object
          properties:
            error:
              type: string
              example: "Usuario no autenticado"
      500:
        description: Error interno del servidor o no se pudo guardar el entrenamiento.
        schema:
          type: object
          properties:
            error:
              type: string
              examples:
                - "No se pudo guardar el entrenamiento"
                - "Error interno del servidor"
    """
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
    if(UserModel.exist_workout_with_title(usuario, title)):
      return jsonify({"error": "Entrenamieto con ese nombre ya creado"}), 409
        
    result = UserModel.insert_workout_for_user(usuario, entrenamiento)


    if result.modified_count > 0:
      return jsonify({"message": "Entrenamiento guardado exitosamente"}), 201
    else:
      return jsonify({"error": "No se pudo guardar el entrenamiento"}), 500
    
# Endpoint para obtener todos los clientes del entrenador logueado
@user_bp.route('/clients', methods=['GET'])
def obtener_clientes():
    """
    Obtiene la lista de clientes del entrenador logueado.
    ---
    tags:
      - Usuarios
    responses:
      200:
        description: Lista de clientes del entrenador.
        schema:
          type: array
          items:
            type: object # Se deberia definir el esquema del cliente si fuera necesario.
      401:
        description: Usuario no autenticado.
        schema:
          type: object
          properties:
            error:
              type: string
              example: "Usuario no autenticado"
      500:
        description: Error interno del servidor.
        schema:
          type: object
          properties:
            message:
              type: string
              example: "Error al obtener clientes"
    """
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
    """
    Obtiene la información completa de un usuario.
    ---
    tags:
      - Usuarios
    consumes:
      - application/json
    parameters:
      - in: body
        name: body
        description: Datos del usuario a obtener.
        required: true
        schema:
          type: object
          properties:
            usuario:
              type: string
              description: Nombre de usuario.
    responses:
      200:
        description: Información del usuario.
        schema:
          type: object # Se deberia definir el esquema del usuario con asociaciones si fuera necesario.
      404:
        description: Usuario no encontrado.
        schema:
          type: object
          properties:
            error:
              type: string
              example: "Usuario no encontrado"
      500:
        description: Error interno del servidor.
        schema:
          type: object
          properties:
            message:
              type: string
              example: "Error al obtener la información del usuario"
    """

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

    """
    Obtiene el nombre de usuario de la sesión actual.
    ---
    tags:
      - Usuarios
    responses:
      200:
        description: Nombre de usuario.
        schema:
          type: object
          properties:
            usuario:
              type: string
      401:
        description: Usuario no autenticado.
        schema:
          type: object
          properties:
            error:
              type: string
              example: "Usuario no autenticado"
    """
    if 'usuario' not in session:
        return jsonify({"error": "Usuario no autenticado"}), 401
    usuario = session['usuario']
    return jsonify({"usuario": usuario}), 200

@user_bp.route('/data', methods=['POST'])
def save_data():
    """
    Guarda o actualiza los datos del usuario.
    ---
    tags:
      - Usuarios
    consumes:
      - application/json
    parameters:
      - in: body
        name: body
        description: Datos del usuario a guardar o actualizar.
        required: true
        schema:
          type: object # Se deberia definir el esquema de los datos del usuario si fuera necesario.
    responses:
      201:
        description: Datos guardados exitosamente.
        schema:
          type: object
          properties:
            message:
              type: string
              example: "Datos guardados exitosamente"
      401:
        description: Usuario no autenticado.
        schema:
          type: object
          properties:
            error:
              type: string
              example: "Usuario no autenticado"
      500:
        description: Error interno del servidor o no se pudo guardar los datos.
        schema:
          type: object
          properties:
            error:
              type: string
              examples:
                - "No se pudo guardar los datos"
                - "Error al guardar los datos"
    """
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
    """
    Obtiene la información de un cliente para un entrenador.
    ---
    tags:
      - Usuarios
    consumes:
      - application/json
    parameters:
      - in: body
        name: body
        description: Datos del cliente a obtener.
        required: true
        schema:
          type: object
          properties:
            usuario:
              type: string
              description: Nombre de usuario del cliente.
    responses:
      200:
        description: Información del cliente.
        schema:
          type: object # Se deberia definir el esquema del cliente con la informacion permitida si fuera necesario.
      401:
        description: Usuario no autenticado.
        schema:
          type: object
          properties:
            error:
              type: string
              example: "Usuario no autenticado"
      403:
        description: El entrenador no tiene permiso para ver la información del cliente.
        schema:
          type: object
          properties:
            error:
              type: string
              example: "No tienes permiso para ver la información de este cliente"
      404:
        description: Usuario no encontrado.
        schema:
          type: object
          properties:
            error:
              type: string
              example: "Usuario no encontrado"
      500:
        description: Error interno del servidor.
        schema:
          type: object
          properties:
            error:
              type: string
              example: "Error al obtener la información del cliente"
    """
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
            "datos": cliente_info.get("datos"),
            "attrDinamicos" : cliente_info.get("atributosDinamicos")
        }

        asociaciones = getAssociationByUser(usuarioCliente)
        asociaciones = [asociacion for asociacion in asociaciones if asociacion.get('usuarioEntrenador') == usuario]
        asociaciones_list = list(asociaciones)
        # Combinar la información del usuario con las asociaciones
        info_permitida['asociacion'] = asociaciones_list

        if(len(asociaciones_list) == 0):
            return jsonify({"error": "No tienes permiso para ver la información de este cliente"}), 403

        # Utilizamos `dumps` de `bson.json_util` para serializar correctamente los datos de MongoDB
        return dumps(info_permitida), 200, {'Content-Type': 'application/json'}
    except Exception as e:
        return jsonify({"error": "Error al obtener la información del cliente"}), 500
    

@user_bp.route('/attrdinamico', methods=['POST'])
def update_dynamic_attribute():
    """
    Agrega o actualiza un atributo dinámico para un usuario.
    ---
    tags:
      - Usuarios
    consumes:
      - application/json
    parameters:
      - in: body
        name: body
        description: Datos para agregar o actualizar el atributo dinámico.
        required: true
        schema:
          type: object
          properties:
            fecha:
              type: string
              description: Fecha a la que corresponde el dato.
            nombre_atributo:
              type: string
              description: Nombre del atributo dinámico.
            valor:
              type: object
              description: Valor del atributo dinámico.
    responses:
      200:
        description: Atributo dinámico actualizado correctamente.
        schema:
          type: object
          properties:
            message:
              type: string
              example: "Atributo dinámico actualizado correctamente"
      400:
        description: Datos de entrada inválidos.
        schema:
          type: object
          properties:
            error:
              type: string
              example: "Datos de entrada inválidos"
      401:
        description: Usuario no autenticado.
        schema:
          type: object
          properties:
            error:
              type: string
              example: "Usuario no autenticado"
      404:
        description: Usuario no encontrado.
        schema:
          type: object
          properties:
            error:
              type: string
              example: "Usuario no encontrado"
      500:
        description: Error interno del servidor.
        schema:
          type: object
          properties:
            error:
              type: string
              example: "Error al actualizar el atributo dinamico"
    """
    if 'usuario' not in session:
        return jsonify({"error": "Usuario no autenticado"}), 401

    data = request.get_json()
    if not data or 'nombre_atributo' not in data or 'valor' not in data or 'fecha' not in data or 'valorTipo' not in data:
        return jsonify({"error": "Datos de entrada inválidos"}), 400
    usuario = session['usuario']
    nombre_atributo = data['nombre_atributo']
    valor = data['valor']
    fecha = data['fecha']
    valorTipo = data['valorTipo']

    try:
        if UserModel.update_dynamic_attribute(usuario, nombre_atributo, valor, fecha, valorTipo):
            return jsonify({"message": "Atributo dinamico actualizado correctamente"}), 200
        else:
            return jsonify({"error": "Usuario no encontrado"}), 404
    except Exception as e:
        return jsonify({"error": f"Error al actualizar el atributo dinamico: {str(e)}"}), 500



@user_bp.route('/diet', methods=['POST'])
def save_diet():
    """
    Guarda una nueva dieta para el usuario.
    ---
    tags:
      - Usuarios
    consumes:
      - application/json
    parameters:
      - in: body
        name: body
        description: Datos de la dieta a guardar.
        required: true
        schema:
          type: object
          properties:
            dietName:
              type: string
              description: Nombre de la dieta.
            days:
              type: array
              description: Lista de días de la dieta.
              items:
                type: object
                properties:
                  name:
                    type: string
                    description: Nombre del día (ejemplo Lunes).
                  meals:
                    type: array
                    description: Lista de comidas del día.
                    items:
                      type: object
                      properties:
                        name:
                          type: string
                          description: Nombre de la comida.
                        foods:
                          type: array
                          description: Lista de alimentos de la comida.
                          items:
                            type: object
                            properties:
                              name:
                                type: string
                                description: Nombre del alimento.
                              grams:
                                type: number
                                description: Cantidad en gramos.
    responses:
      201:
        description: Dieta guardada exitosamente.
        schema:
          type: object
          properties:
            message:
              type: string
              example: "Dieta guardada exitosamente"
      401:
        description: Usuario no autenticado.
        schema:
          type: object
          properties:
            error:
              type: string
              example: "Usuario no autenticado"
      500:
        description: Error interno del servidor o no se pudo guardar la dieta.
        schema:
          type: object
          properties:
            error:
              type: string
              examples:
                - "No se pudo guardar la dieta"
                - "Error interno del servidor"
    """
    # Verificar que el usuario esté logueado
    if 'usuario' not in session:
        return jsonify({"error": "Usuario no autenticado"}), 401

    # Obtener el ID del usuario desde la sesión
    usuario = session['usuario']

    data = request.json
    title = data.get('dietName', 'Entrenamiento sin título')
    days = data.get('days', [])

    # Crear la dieta
    diet = {
        "title": title,
        "days": days
    }

    result = UserModel.insert_diet_for_user(usuario, diet)


    if result.modified_count > 0:
        return jsonify({"message": "Dieta guardada exitosamente"}), 201
    else:
        return jsonify({"error": "No se pudo guardar la dieta"}), 500


@user_bp.route('/diets', methods=['GET'])
def get_diets():

    """
    Obtiene las dietas del usuario.
    ---
    tags:
      - Usuarios
    responses:
      200:
        description: Lista de dietas del usuario.
        schema:
          type: array
          items:
            type: object
            properties:
              _id:
                type: string
                description: ID de la dieta.
              title:
                type: string
                description: Nombre de la dieta.
              days:
                type: array
                description: Lista de días de la dieta.
                items:
                  type: object
                  properties:
                    name:
                      type: string
                      description: Nombre del día.
                    meals:
                      type: array
                      description: Lista de comidas del día.
                      items:
                        type: object
                        properties:
                          name:
                            type: string
                            description: Nombre de la comida.
                          foods:
                            type: array
                            description: Lista de alimentos de la comida.
                            items:
                              type: object
                              properties:
                                name:
                                  type: string
                                  description: Nombre del alimento.
                                grams:
                                  type: number
                                  description: Cantidad en gramos.
      401:
        description: Usuario no autenticado.
        schema:
          type: object
          properties:
            error:
              type: string
              example: "Usuario no autenticado"
      500:
        description: Error interno del servidor.
        schema:
          type: object
          properties:
            message:
              type: string
              example: "Error al obtener dietas"
    """
    
    if 'usuario' not in session:
        return jsonify({"error": "Usuario no autenticado"}), 401
    usuario = session['usuario']
    try:
        diets = UserModel.get_diets_for_user(usuario)
        diets_list = list(diets)
        return dumps(diets_list), 200, {'Content-Type': 'application/json'}
    except Exception:
        return jsonify({"message": "Error al obtener entrenamientos"}), 500
    

@user_bp.route('/modworkout', methods=['POST'])
def modify_workout():
    """
    Guarda un nuevo entrenamiento para el usuario.
    ---
    tags:
      - Usuarios
    consumes:
      - application/json
    parameters:
      - in: body
        name: body
        description: Datos del entrenamiento a guardar.
        required: true
        schema:
          type: object
          properties:
            title:
              type: string
              description: Título del entrenamiento.
            description:
              type: string
              description: Descripción del entrenamiento.
            weeks:
              type: array
              items:
                type: object # Se deberia definir el esquema de la semana si fuera necesario.
              description: Semanas del entrenamiento.
    responses:
      201:
        description: Entrenamiento guardado exitosamente.
        schema:
          type: object
          properties:
            message:
              type: string
              example: "Entrenamiento guardado exitosamente"
      401:
        description: Usuario no autenticado.
        schema:
          type: object
          properties:
            error:
              type: string
              example: "Usuario no autenticado"
      500:
        description: Error interno del servidor o no se pudo guardar el entrenamiento.
        schema:
          type: object
          properties:
            error:
              type: string
              examples:
                - "No se pudo guardar el entrenamiento"
                - "Error interno del servidor"
    """
    # Verificar que el usuario esté logueado
    if 'usuario' not in session:
        return jsonify({"error": "Usuario no autenticado"}), 401

    # Obtener el ID del usuario desde la sesión
    usuario = session['usuario']

    data = request.json
    title = data.get('title', 'Entrenamiento sin título')
    description = data.get('description', 'Sin descripción')
    weeks = data.get('weeks', [])

    tituloAnterior = request.args.get('titulo')

    # Crear el entrenamiento con un ID único
    entrenamiento = {
      "title": title,
      "description": description,
      "weeks": weeks
    }
        
    result = UserModel.update_workout_for_user(usuario, tituloAnterior, entrenamiento)

    if result.modified_count > 0:
      return jsonify({"message": "Entrenamiento modificado exitosamente"}), 201
    else:
      return jsonify({"error": "No se pudo modificar el entrenamiento"}), 500
    

@user_bp.route('/moddiet', methods=['POST'])
def modify_diet():
    """
    Guarda un nuevo entrenamiento para el usuario.
    ---
    tags:
      - Usuarios
    consumes:
      - application/json
    parameters:
      - in: body
        name: body
        description: Datos del entrenamiento a guardar.
        required: true
        schema:
          type: object
          properties:
            title:
              type: string
              description: Título del entrenamiento.
            description:
              type: string
              description: Descripción del entrenamiento.
            weeks:
              type: array
              items:
                type: object # Se deberia definir el esquema de la semana si fuera necesario.
              description: Semanas del entrenamiento.
    responses:
      201:
        description: Entrenamiento guardado exitosamente.
        schema:
          type: object
          properties:
            message:
              type: string
              example: "Entrenamiento guardado exitosamente"
      401:
        description: Usuario no autenticado.
        schema:
          type: object
          properties:
            error:
              type: string
              example: "Usuario no autenticado"
      500:
        description: Error interno del servidor o no se pudo guardar el entrenamiento.
        schema:
          type: object
          properties:
            error:
              type: string
              examples:
                - "No se pudo guardar el entrenamiento"
                - "Error interno del servidor"
    """
    if 'usuario' not in session:
        return jsonify({"error": "Usuario no autenticado"}), 401

    usuario = session['usuario']

    data = request.json
    dietName = data.get('dietName', 'Dieta sin título')
    days = data.get('days', [])

    tituloAnterior = request.args.get('titulo')

    dieta = {
      "dietName": dietName,
      "days": days
    }
        
    result = UserModel.update_diet_for_user(usuario, tituloAnterior, dieta)

    if result.modified_count > 0:
      return jsonify({"message": "Dieta editada exitosamente"}), 201
    else:
      return jsonify({"error": "No se pudo editar la dieta"}), 500
    
@user_bp.route('/delworkout', methods=['DELETE'])
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

    workoutTitle = request.args.get('titulo')
    id_entrenador = session['usuario']

    if workoutTitle and id_entrenador:
        result = UserModel.remove_workout_for_user(id_entrenador, workoutTitle)
        if result.modified_count > 0:
            return jsonify({"mensaje": "Entrenamiento eliminado con éxito"}), 200
        else:
            return jsonify({"mensaje": "El entrenamiento no existe"}), 404
    else:
        return jsonify({"mensaje": "Faltan datos"}), 400
    