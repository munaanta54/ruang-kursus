from django.db.models.signals import post_save,post_delete,pre_save
from django.dispatch import receiver
from courses.models import Course
from participants.models import Participant
from .models import Activity
@receiver(post_save,sender=Course)
def course_saved(sender,instance,created,**kwargs): Activity.objects.create(message=f"Course {instance.title} {'ditambahkan' if created else 'diperbarui'}",activity_type="course_created" if created else "course_updated",course=instance)
@receiver(post_delete,sender=Course)
def course_deleted(sender,instance,**kwargs): Activity.objects.create(message=f"Course {instance.title} dihapus",activity_type="course_deleted")
@receiver(pre_save,sender=Participant)
def participant_before(sender,instance,**kwargs):
    instance._became_completed=False
    if instance.pk:
        try: instance._became_completed=(not Participant.objects.get(pk=instance.pk).completed and instance.completed)
        except Participant.DoesNotExist: pass
@receiver(post_save,sender=Participant)
def participant_saved(sender,instance,created,**kwargs):
    typ="participant_created" if created else ("course_completed" if getattr(instance,"_became_completed",False) else "participant_updated")
    msg=f"Peserta {instance.name} {'ditambahkan' if created else ('menyelesaikan '+instance.course.title if typ=='course_completed' else 'diperbarui')}"
    Activity.objects.create(message=msg,activity_type=typ,course=instance.course,participant=instance)
@receiver(post_delete,sender=Participant)
def participant_deleted(sender,instance,**kwargs): Activity.objects.create(message=f"Peserta {instance.name} dihapus",activity_type="participant_deleted",course=instance.course)
