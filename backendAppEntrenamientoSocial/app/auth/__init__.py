from flask import Blueprint
from flask_cors import CORS

auth_bp = Blueprint('auth', __name__)

from . import routes