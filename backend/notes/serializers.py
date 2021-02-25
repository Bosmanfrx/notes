from rest_framework.serializers import HyperlinkedModelSerializer

from notes.models import Note


class NoteSerializer(HyperlinkedModelSerializer):

    class Meta:
        model = Note
        fields = ('id', 'text_model', 'valid_to', 'password')
        extra_kwargs = {
            'valid_to': {'write_only': True},
            'password': {'write_only': True}
        }
