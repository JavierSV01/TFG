from app import create_app, socketio
from dotenv import load_dotenv
from app.config import Config
import os

load_dotenv()
hostEnv = os.getenv('BACKEND_HOST')
portEnv = os.getenv('BACKEND_PORT')

app = create_app(Config)

if __name__ == "__main__":
    socketio.run(app, host=hostEnv, port=portEnv, debug=True)
    #app.run(host=hostEnv, port=portEnv)

from app import create_app, socketio
from dotenv import load_dotenv
from app.config import Config
from flask_cors import CORS
from flask_session import Session
import os

load_dotenv()
hostEnv = os.getenv('BACKEND_HOST')
portEnv = os.getenv('BACKEND_PORT')

app = create_app(Config)

# Configurar sesiones para que las cookies sean accesibles en móviles
app.config['SESSION_TYPE'] = 'filesystem'  # Cambia a 'redis' si usas Redis en Render
app.config['SESSION_PERMANENT'] = True
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SECURE'] = True  # Necesario para HTTPS
app.config['SESSION_COOKIE_SAMESITE'] = "None"  # Permitir cookies en peticiones CORS

# Inicializar sesiones
Session(app)

# Configurar CORS para permitir cookies
CORS(app, supports_credentials=True, origins="*")


if __name__ == "__main__":
    socketio.run(app, host=hostEnv, port=portEnv, debug=True)
