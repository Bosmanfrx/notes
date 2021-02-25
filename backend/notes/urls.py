from django.urls import path

from notes.views import RetrieveNoteView, CreateNoteView

urlpatterns = [
    path('', CreateNoteView.as_view(), name='note_create'),
    path('<uuid:id>', RetrieveNoteView.as_view(), name='note_retrieve'),
]
