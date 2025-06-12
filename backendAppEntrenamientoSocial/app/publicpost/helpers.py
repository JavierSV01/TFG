from pymongo import MongoClient
from flask import current_app
from .models import PublicPostModel

def get_posts_by_ids(post_ids):
    return PublicPostModel.get_posts_by_ids(post_ids)