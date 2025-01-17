from pymongo import MongoClient
from flask import current_app
from .models import UserModel

def insert_notification_for_user(user, noti):
    UserModel.insert_notification_for_user(user, noti)
def get_one_workout_for_user(user, workoutTitle):
    return UserModel.get_one_workout_for_user(user, workoutTitle)
def user_exists(user):
    return UserModel.user_exists(user)
