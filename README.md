# Proyecto de Fin de Grado - Aplicación Web con React y Flask

Este proyecto consiste en una aplicación web desarrollada con **React** (frontend) y **Flask** (backend), conectada a una base de datos **MongoDB**.

---

## 🚀 Requisitos del sistema

Para ejecutar correctamente este proyecto, se requieren **tres servidores funcionando**:

1. **Servidor Backend (Flask + Python)**
2. **Servidor Frontend (React)**
3. **Servidor de base de datos MongoDB**

---

## 🔧 Instalación de dependencias

### Backend (Python + Flask)

#### Requisitos:
- Python 3.13.3
- MongoDB instalado en el sistema anfitrión

#### Pasos de instalación:

```bash
sudo apt install python3.12-venv
python3 -m venv venv
source venv/bin/activate
```

Instalación de dependencias:

```bash
pip install Flask Flask-CORS
pip install Flask-PyMongo
pip install python-dotenv
pip install Flask-SocketIO
pip install flask-swagger-ui flasgger
```

Instalar MongoDB si no está disponible en otro servidor:
- https://www.mongodb.com/try/download/community

---

### Frontend (React)

#### Requisitos:
- Node.js y npm

#### Pasos de instalación:

```bash
sudo apt install npm
```

Instalación de dependencias del proyecto (en la carpeta del frontend):

```bash
npm install
npm install axios
npm install react-router-dom
npm install @chakra-ui/icons
npm install react-chartjs-2 chart.js
npm install react-hook-form
npm install socket.io-client
npm install keen-slider
npm install react-icons
```

> ⚠️ **Importante:** Algunas dependencias podrían tener versiones más nuevas al momento de la instalación. Asegúrate de revisar posibles incompatibilidades con el repositorio original.

---

## ⚙️ Variables de entorno

Es necesario configurar las variables de entorno en **ambos proyectos** (frontend y backend).

### Backend – `.env`

```env
MONGO_URI=mongodb://localhost:27017/tu_base_de_datos
FRONTEND_URL=http://localhost:3000
```

### Frontend – `.env`

```env
REACT_APP_BACKEND_URL=http://localhost:5000
```

Ajusta las URLs según la ubicación de tus servidores.

---

## ▶️ Ejecución del proyecto

### Lanzar el Backend (Flask)

Desde la carpeta del backend:

```bash
source venv/bin/activate
python3 run.py
```

Asegúrate de que MongoDB esté en funcionamiento antes de lanzar el backend.

---

### Lanzar el Frontend (React)

Desde la carpeta del frontend:

```bash
npm start
```

La aplicación estará disponible en: http://localhost:3000

---

## 📜 Scripts disponibles (Frontend)

En el directorio del frontend puedes ejecutar:

### `npm start`

Inicia la aplicación en modo desarrollo.  
Abre [http://localhost:3000](http://localhost:3000) en el navegador.  
La página se recargará si haces cambios y mostrará errores de lint en la consola.

### `npm test`

Ejecuta el test runner en modo interactivo.  
Más información en: https://facebook.github.io/create-react-app/docs/running-tests

### `npm run build`

Compila la app para producción en la carpeta `build`.  
La build está optimizada y minificada, con nombres de archivo con hash para cacheo.

Más información en: https://facebook.github.io/create-react-app/docs/deployment

### `npm run eject`

⚠️ Esta operación es irreversible.  
Copia toda la configuración de build y dependencias para darte control total.

---

## 📚 Recursos adicionales

- Documentación de React: https://reactjs.org/
- Documentación de Create React App: https://facebook.github.io/create-react-app/
- Documentación de Flask: https://flask.palletsprojects.com/
- Documentación de MongoDB: https://www.mongodb.com/docs/

