from rest_framework import serializers
from .models import Participant
class ParticipantSerializer(serializers.ModelSerializer):
    course_title=serializers.CharField(source="course.title",read_only=True)
    class Meta:
        model=Participant; fields=["id","name","email","course","course_title","completed","joined_at","updated_at"]; read_only_fields=["id","joined_at","updated_at"]
