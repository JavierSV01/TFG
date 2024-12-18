from flask import Flask, request, make_response
from flask_pymongo import PyMongo  # Si usas PyMongo para MongoDB
from flask_cors import CORS
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
# Inicializar extensiones
mongo = PyMongo()

def create_app(config_object):
    
    app = Flask(__name__)
    # Configuración de CORS más específica
    CORS(app, resources={r"/*": {
        "origins": "http://localhost:3000",  # URL específica de tu frontend
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": [
            "X-CSRF-Token", "X-Requested-With", "Accept", "Accept-Version",
            "Content-Length", "Content-MD5", "Content-Type", "Date",
            "X-Api-Version", "Authorization"
        ],
        "expose_headers": ["Content-Range", "X-Content-Range"],
        "supports_credentials": True,
        "max_age": 86400  # Cache preflight requests for 24 hours
    }})

    # Manejador específico para OPTIONS
    @app.before_request
    def handle_preflight():
        if request.method == "OPTIONS":
            response = make_response()
            response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
            response.headers.add("Access-Control-Allow-Credentials", "true")
            response.headers.add("Access-Control-Allow-Headers", "*")
            response.headers.add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
            return response

    #app.config.from_object(config_object)
    #app.config['SESSION_COOKIE_SAMESITE'] = 'None'  # Permite compartir cookies entre sitios
    #app.config['SESSION_COOKIE_SECURE'] = True      # Requiere HTTPS; usa False solo para desarrollo en HTTP
    
    #app.config["MONGO_URI"] = "mongodb://localhost:27017/appEntrenamiento"
    #app.config["MONGO_URI"] = "mongodb+srv://javier:javier@cluster0.i0x30.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    app.config["MONGO_URI"] = "mongodb+srv://javier:javier@cluster0.i0x30.mongodb.net/appEntrenamiento"

    mongo.init_app(app)


    # Realizar un "ping" para verificar la conexión a Atlas
    try:
        uri = app.config["MONGO_URI"]
        client = MongoClient(uri, server_api=ServerApi('1'))
        client.admin.command('ping')
        print("Pinged your deployment. You successfully connected to MongoDB!")
    except Exception as e:
        print("Error al conectar a MongoDB:", e)
    
    from .user import user_bp as user_blueprint
    app.register_blueprint(user_blueprint, url_prefix='/user')

    from .solicitude import solicitude_bp as sol_blueprint
    app.register_blueprint(sol_blueprint, url_prefix='/sol')

    @app.route("/")
    def home():
        return "¡Hola desde Flask con Blueprints en Vercel!"

    return app
