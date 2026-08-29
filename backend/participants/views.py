from rest_framework import viewsets,filters
from .models import Participant
from .serializers import ParticipantSerializer
class ParticipantViewSet(viewsets.ModelViewSet):
    queryset=Participant.objects.select_related("course").all(); serializer_class=ParticipantSerializer; filter_backends=[filters.SearchFilter]; search_fields=["name","email","course__title"]
