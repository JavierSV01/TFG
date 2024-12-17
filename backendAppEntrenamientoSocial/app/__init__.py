from flask import Flask
from flask_pymongo import PyMongo  # Si usas PyMongo para MongoDB
from flask_cors import CORS
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi


def create_app():

    # Inicializar extensiones
    mongo = PyMongo()
    
    app = Flask(__name__)

    CORS(app, supports_credentials=True, resources={r"/*": {
        "origins": "*",  # Dominios permitidos
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],  # Métodos permitidos
        "allow_headers": ["Content-Type", "Authorization"]  # Encabezados permitidos
    }})

    app.config['SESSION_COOKIE_SAMESITE'] = 'None'  # Permite compartir cookies entre sitios
    app.config['SESSION_COOKIE_SECURE'] = True      # Requiere HTTPS; usa False solo para desarrollo en HTTP
    #app.config["MONGO_URI"] = "mongodb://localhost:27017/appEntrenamiento"
    #app.config["MONGO_URI"] = "mongodb+srv://javier:javier@cluster0.i0x30.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    app.config["MONGO_URI"] = "mongodb+srv://javier:javier@cluster0.i0x30.mongodb.net/appEntrenamiento"

    mongo.init_app(app)


    
    from .user import user_bp as user_blueprint
    app.register_blueprint(user_blueprint, url_prefix='/user')

    from .solicitude import solicitude_bp as sol_blueprint
    app.register_blueprint(sol_blueprint, url_prefix='/sol')

    @app.route("/")
    def home():
        return "¡Hola desde Flask con Blueprints en Vercel!"

    return app
