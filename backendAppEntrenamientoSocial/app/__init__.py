from flask import Flask
from flask_pymongo import PyMongo  # Si usas PyMongo para MongoDB
from flask_cors import CORS
from app.blueprints.auth import auth_bp

# Inicializar extensiones
mongo = PyMongo()

def create_app(config_object):
    """Crea y configura la aplicación Flask"""
    app = Flask(__name__)

    # Cargar configuración
    app.config.from_object(config_object)

    # Inicializar extensiones
    mongo.init_app(app)
    CORS(app, supports_credentials=True)

    # Registra los blueprints
    app.register_blueprint(auth_bp)

    # Registrar otros blueprints si existen
    # from app.auth import auth_bp
    # app.register_blueprint(auth_bp)

    return app
