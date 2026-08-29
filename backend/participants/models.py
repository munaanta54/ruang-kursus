from django.db import models
from courses.models import Course
class Participant(models.Model):
    name=models.CharField(max_length=120); email=models.EmailField(); course=models.ForeignKey(Course,on_delete=models.CASCADE,related_name="participant_list"); completed=models.BooleanField(default=False); joined_at=models.DateTimeField(auto_now_add=True); updated_at=models.DateTimeField(auto_now=True)
    class Meta: ordering=["-joined_at"]
    def __str__(self): return self.name
