from app import create_app
from dotenv import load_dotenv
from app.config import Config
import os

app = create_app()

if __name__ == "__main__":
    app.run()