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