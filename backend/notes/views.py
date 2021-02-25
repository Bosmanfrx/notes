from django.contrib.auth.hashers import make_password
from django.db.models import Q
from rest_framework.generics import CreateAPIView, GenericAPIView
from rest_framework.mixins import RetrieveModelMixin
from rest_framework.response import Response
from django.utils import timezone


from notes.models import Note
from notes.permissions import HasCorrectPasswordPermission
from notes.serializers import NoteSerializer


class CreateNoteView(CreateAPIView):
    serializer_class = NoteSerializer

    def perform_create(self, serializer) -> None:
        password = self.request.data.get('password')
        if password is not None:
            password = make_password(password)
            serializer.save(password=password)
        else:
            serializer.save()


class RetrieveNoteView(RetrieveModelMixin, GenericAPIView):
    serializer_class = NoteSerializer
    permission_classes = (HasCorrectPasswordPermission,)
    lookup_field = 'id'

    def get_queryset(self):
        return Note.objects.filter(Q(valid_to__gt=timezone.now()) | Q(valid_to__isnull=True))

    def post(self, request, *args, **kwargs) -> Response:
        return self.retrieve(request, *args, **kwargs)
