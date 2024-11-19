from flask import Blueprint
from flask_cors import CORS

solicitude_bp = Blueprint('sol', __name__)

from . import routes