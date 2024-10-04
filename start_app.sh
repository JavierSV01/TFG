#!/bin/bash

# Levantar el backend
echo "Iniciando el backend..."
cd ./backendAppEntrenamientoSocial || exit
source venv/bin/activate  # Activa el entorno virtual
python3 index.py &  # El símbolo & permite que el comando se ejecute en segundo plano

# Esperar un segundo para asegurarse de que el backend se levante primero
sleep 1

# Levantar el frontend
echo "Iniciando el frontend..."
cd ../frontendapp || exit
npm start
