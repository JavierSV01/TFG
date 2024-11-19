from flask import Blueprint
from flask_cors import CORS

user_bp = Blueprint('user', __name__)

from . import routes
from . import helpers