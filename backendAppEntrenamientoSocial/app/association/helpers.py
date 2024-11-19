from .model import AssociationModel

def existAssociation(usuario_cliente, usuario_entrenador):
    return AssociationModel.existAssociation(usuario_cliente, usuario_entrenador)

def insertAssociation(association):
    return AssociationModel.insertAssociation(association)