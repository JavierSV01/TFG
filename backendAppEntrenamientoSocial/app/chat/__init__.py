from flask import Blueprint
from flask_cors import CORS

chat_bp = Blueprint('chat', __name__)

from . import routes
from . import helpers