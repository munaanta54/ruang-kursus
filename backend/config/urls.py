from django.contrib import admin
from django.urls import include, path

from .views import api_home, get_weather
from .chatbot_views import chat


urlpatterns = [
    path("", api_home, name="api-home"),

    path("admin/", admin.site.urls),

    path(
        "api/courses/",
        include("courses.urls")
    ),

    path(
        "api/participants/",
        include("participants.urls")
    ),

    path(
        "api/activities/",
        include("activities.urls")
    ),

    path(
        "api/weather/",
        get_weather,
        name="api-weather"
    ),

    path(
        "api/chat/",
        chat,
        name="api-chat"
    ),
]