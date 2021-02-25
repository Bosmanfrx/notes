import uuid

from django.db import models


class Note(models.Model):
    id = models.UUIDField(primary_key=True, editable=False, default=uuid.uuid4)
    text_model = models.JSONField()
    valid_to = models.DateTimeField(auto_now=False, blank=True, null=True)
    password = models.CharField(max_length=128, blank=True)

    def __str__(self) -> str:
        return f'Note #{self.id}'

    class Meta:
        verbose_name = 'Note'
        verbose_name_plural = 'Notes'
