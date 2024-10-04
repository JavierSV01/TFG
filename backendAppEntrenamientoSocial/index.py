from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Permitir solicitudes desde cualquier origen

@app.route('/')
def home():
    return "¡Hola, mundo!"

# Simulación de usuarios almacenados (esto debería venir de una base de datos)
usuarios = {
    'usuario1': 'password123',
    'usuario2': '123456',
    'ane': 'lachupa',
    'angel': 'lamama',
    
}

# Endpoint para validar credenciales
@app.route('/login', methods=['POST'])
def login():
    datos = request.json  # Obtener datos enviados en formato JSON
    username = datos.get('username')
    password = datos.get('password')

    # Validar si el usuario y la contraseña son correctos
    if username in usuarios and usuarios[username] == password:
        return jsonify({"valid": True, "mensaje": "Inicio de sesión válido"}), 200
    else:
        return jsonify({"valid": False, "mensaje": "Usuario o contraseña incorrectos"}), 401


if __name__ == '__main__':
    app.run(port=3001)