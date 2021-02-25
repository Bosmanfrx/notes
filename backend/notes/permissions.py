from django.contrib.auth.hashers import check_password
from rest_framework.permissions import BasePermission
from rest_framework.request import Request

from notes.models import Note


class HasCorrectPasswordPermission(BasePermission):

    def has_object_permission(self, request: Request, view, obj: Note):
        if not obj.password:
            return True

        password = request.data.get('password', '')
        return check_password(password, obj.password)
