from pathlib import Path
import os
from dotenv import load_dotenv
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "ruangkursus-dev-key")
DEBUG = True
ALLOWED_HOSTS = ["localhost", "127.0.0.1"]
INSTALLED_APPS = [
 "django.contrib.admin","django.contrib.auth","django.contrib.contenttypes","django.contrib.sessions","django.contrib.messages","django.contrib.staticfiles",
 "corsheaders","rest_framework","courses","participants","activities.apps.ActivitiesConfig",
]
MIDDLEWARE = ["corsheaders.middleware.CorsMiddleware","django.middleware.security.SecurityMiddleware","django.contrib.sessions.middleware.SessionMiddleware","django.middleware.common.CommonMiddleware","django.middleware.csrf.CsrfViewMiddleware","django.contrib.auth.middleware.AuthenticationMiddleware","django.contrib.messages.middleware.MessageMiddleware","django.middleware.clickjacking.XFrameOptionsMiddleware"]
ROOT_URLCONF="config.urls"
TEMPLATES=[{"BACKEND":"django.template.backends.django.DjangoTemplates","DIRS":[],"APP_DIRS":True,"OPTIONS":{"context_processors":["django.template.context_processors.request","django.contrib.auth.context_processors.auth","django.contrib.messages.context_processors.messages"]}}]
WSGI_APPLICATION="config.wsgi.application"
DATABASES={"default":{"ENGINE":"django.db.backends.sqlite3","NAME":BASE_DIR/"db.sqlite3"}}
AUTH_PASSWORD_VALIDATORS=[]
LANGUAGE_CODE="id"
TIME_ZONE="Asia/Jakarta"
USE_I18N=True
USE_TZ=True
STATIC_URL="static/"
DEFAULT_AUTO_FIELD="django.db.models.BigAutoField"
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",

    "http://localhost:5174",
    "http://127.0.0.1:5174",
]
REST_FRAMEWORK={"DEFAULT_PAGINATION_CLASS":"rest_framework.pagination.PageNumberPagination","PAGE_SIZE":20}
WEATHER_API_KEY=os.getenv("WEATHER_API_KEY")
WEATHER_API_BASE_URL="https://api.openweathermap.org/data/2.5/weather"

# tes
