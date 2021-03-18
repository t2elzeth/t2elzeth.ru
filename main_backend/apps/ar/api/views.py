from rest_framework import mixins, viewsets

from . import serializers
from .. import models


class ARNotRenderedView(mixins.ListModelMixin,
                        mixins.UpdateModelMixin,
                        viewsets.GenericViewSet):
    serializer_class = serializers.ARListSerializer
    queryset = models.AR.objects.filter(is_rendered=False)

    def get_serializer_class(self):
        if self.action == 'list':
            return serializers.ARListSerializer
        elif self.action == 'update':
            return serializers.ARIsRenderedSerializer

    def perform_update(self, serializer):
        code = serializer.validated_data.get("code")

        if code == 0:
            instance: models.AR = self.get_object()
            # instance.owner.email_user("Your AR has been rendered out!",
            #                           "Your AR project is ready to use!")

            instance.is_rendered = True
            return instance.save()
        print("An error occured!")
