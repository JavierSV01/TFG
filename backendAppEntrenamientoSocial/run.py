from app import create_app, socketio # Asumo que 'create_app' crea la instancia de Flask y 'socketio' está ya asociada a ella.
from app.config import Config
from flask import jsonify # Importamos jsonify para el health check
from flasgger import Swagger

app = create_app(Config)
swagger = Swagger(app)

@app.route('/')
def health_check():
    """
    Ruta simple para el chequeo de salud de Render.
    """
    return jsonify({"status": "healthy", "message": "Backend is running!"}), 200

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    host = '0.0.0.0' 

    print(f"Running Flask app with Socket.IO locally on {host}:{port}")
    socketio.run(app, host=host, port=port, debug=True)