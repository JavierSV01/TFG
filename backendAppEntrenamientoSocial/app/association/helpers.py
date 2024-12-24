from .models import AssociationModel

def existAssociation(usuario_cliente, usuario_entrenador):
    return AssociationModel.existAssociation(usuario_cliente, usuario_entrenador)

def insertAssociation(association):
    return AssociationModel.insertAssociation(association)

def getClientsByTrainer(usuario_entrenador):
    return AssociationModel.getClientsByTrainer(usuario_entrenador)

def getAssociationByUser(usuario_cliente):
    return AssociationModel.getAssociationByUser(usuario_cliente)