from flask import Blueprint
from flask_cors import CORS

post_bp = Blueprint('publicpost', __name__)

from . import routes