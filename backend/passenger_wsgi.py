import os, sys, pathlib
BASE_DIR = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(BASE_DIR))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", os.getenv("DJANGO_SETTINGS_MODULE", "labosfera_project.settings_hosting"))
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
