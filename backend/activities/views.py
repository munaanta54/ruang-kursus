from rest_framework import viewsets,filters
from .models import Activity
from .serializers import ActivitySerializer
class ActivityViewSet(viewsets.ReadOnlyModelViewSet):
    queryset=Activity.objects.select_related("course","participant").all(); serializer_class=ActivitySerializer; filter_backends=[filters.SearchFilter]; search_fields=["message","course__title","participant__name"]
