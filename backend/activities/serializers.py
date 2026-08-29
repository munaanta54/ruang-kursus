from rest_framework import serializers
from .models import Activity
class ActivitySerializer(serializers.ModelSerializer):
    activity_label=serializers.CharField(source="get_activity_type_display",read_only=True); course_title=serializers.CharField(source="course.title",read_only=True); participant_name=serializers.CharField(source="participant.name",read_only=True)
    class Meta: model=Activity; fields=["id","message","activity_type","activity_label","course","course_title","participant","participant_name","created_at"]
