from flask import Blueprint
from flask_cors import CORS

image_bp = Blueprint('image', __name__)

from . import helpers
from . import routes