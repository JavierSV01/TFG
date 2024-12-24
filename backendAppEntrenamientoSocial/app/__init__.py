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
    
    from .user import user_bp as user_blueprint
    app.register_blueprint(user_blueprint, url_prefix='/user')

    from .solicitude import solicitude_bp as sol_blueprint
    app.register_blueprint(sol_blueprint, url_prefix='/sol')

    from .association import association_bp as ass_blueprint
    app.register_blueprint(ass_blueprint, url_prefix='/ass')

    return app
