from rest_framework import serializers
from .models import Course
class CourseSerializer(serializers.ModelSerializer):
    participants=serializers.SerializerMethodField()
    class Meta:
        model=Course; fields="__all__"; read_only_fields=["id","participants","created_at","updated_at"]
    def get_participants(self,obj): return obj.participant_list.count()
