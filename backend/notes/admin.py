from django.contrib import admin

from notes.models import Note


@admin.register(Note)
class NotesAdmin(admin.ModelAdmin):
    pass
