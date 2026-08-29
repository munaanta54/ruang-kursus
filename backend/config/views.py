import requests
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
@api_view(["GET"])
def api_home(request): return Response({"name":"RuangKursus API","status":"ok"})
@api_view(["GET"])
def get_weather(request):
    city=request.GET.get("q","Jakarta")
    if not settings.WEATHER_API_KEY: return Response({"detail":"WEATHER_API_KEY belum dikonfigurasi."},status=500)
    try:
        r=requests.get(settings.WEATHER_API_BASE_URL,params={"q":city,"appid":settings.WEATHER_API_KEY,"units":"metric","lang":"id"},timeout=10)
        data=r.json()
        if not r.ok: return Response({"detail":data.get("message","Gagal mengambil cuaca")},status=r.status_code)
        return Response({"city":data["name"],"temperature":round(data["main"]["temp"]),"description":data["weather"][0]["description"],"humidity":data["main"]["humidity"],"wind_speed":data["wind"]["speed"]})
    except requests.RequestException: return Response({"detail":"Tidak dapat terhubung ke OpenWeather."},status=503)
