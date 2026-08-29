from django.db import models
from courses.models import Course
from participants.models import Participant
class Activity(models.Model):
    TYPES=[("course_created","Course Ditambahkan"),("course_updated","Course Diedit"),("course_deleted","Course Dihapus"),("participant_created","Peserta Ditambahkan"),("participant_updated","Peserta Diedit"),("participant_deleted","Peserta Dihapus"),("course_completed","Course Selesai"),("other","Lainnya")]
    message=models.TextField(); activity_type=models.CharField(max_length=40,choices=TYPES,default="other"); course=models.ForeignKey(Course,on_delete=models.SET_NULL,null=True,blank=True,related_name="activity_logs"); participant=models.ForeignKey(Participant,on_delete=models.SET_NULL,null=True,blank=True,related_name="activity_logs"); created_at=models.DateTimeField(auto_now_add=True)
    class Meta: ordering=["-created_at"]
