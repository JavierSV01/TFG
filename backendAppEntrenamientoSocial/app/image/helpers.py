from .models import ImageModel

def saveImage(username, file):
    return ImageModel.saveImage(username, file)