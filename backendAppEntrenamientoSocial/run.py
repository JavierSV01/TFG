from app import create_app
from dotenv import load_dotenv
from app.config import Config
import os

load_dotenv()
hostEnv = os.getenv('BACKEND_HOST')
portEnv = os.getenv('BACKEND_PORT')

app = create_app(Config)

if __name__ == "__main__":
    app.run()