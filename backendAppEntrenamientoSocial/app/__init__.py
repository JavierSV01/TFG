from flask import Flask
from flask_pymongo import PyMongo  # Si usas PyMongo para MongoDB
from flask_cors import CORS
# Inicializar extensiones
mongo = PyMongo()

def create_app(config_object):
    
    app = Flask(__name__)

    CORS(app, supports_credentials=True, resources={r"/*": {
        "origins": "*",  # Dominios permitidos
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],  # Métodos permitidos
        "allow_headers": ["Content-Type", "Authorization"]  # Encabezados permitidos
    }})

    app.config.from_object(config_object)
    app.config['SESSION_COOKIE_SAMESITE'] = 'None'  # Permite compartir cookies entre sitios
    app.config['SESSION_COOKIE_SECURE'] = True      # Requiere HTTPS; usa False solo para desarrollo en HTTP
    app.config["MONGO_URI"] = "mongodb://localhost:27017/appEntrenamiento"

    mongo.init_app(app)
    
    from .auth import auth_bp as auth_blueprint
    app.register_blueprint(auth_blueprint, url_prefix='/auth')

    return app
