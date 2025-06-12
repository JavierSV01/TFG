# gunicorn_conf.py
import os

# La clase de worker que estás usando
worker_class = 'geventwebsocket.gunicorn.workers.GeventWebSocketWorker'
# Solo un worker, a menos que uses una cola de mensajes (Redis)
workers = 1
# Vincular al puerto que Render asigna (ej: 10000)
bind = f'0.0.0.0:{os.environ.get("PORT", "5001")}'
# Aumentar el tiempo de espera, ya que las conexiones WebSocket pueden ser persistentes
timeout = 120 # El valor por defecto de Gunicorn es 30 segundos, 120 es más seguro

# Este gancho se ejecuta en cada proceso de worker después de ser "forkeado"
# y antes de que tu aplicación se cargue completamente.
def post_fork(server, worker):
    try:
        from gevent import monkey
        monkey.patch_all()
        worker.log.info("Gevent monkey patched en worker (post_fork hook)")
    except ImportError:
        worker.log.warning("gevent no encontrado, monkey patching omitido en post_fork.")