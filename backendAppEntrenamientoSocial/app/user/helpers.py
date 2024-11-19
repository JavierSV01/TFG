from pymongo import MongoClient
from flask import current_app
from .models import UserModel

def insert_notification_for_user(user, noti):
    UserModel.insert_notification_for_user(user, noti)
