from rest_framework import mixins, viewsets, status
from rest_framework.response import Response
from django.conf import settings

from . import serializers, email
from .. import models


class ARNotRenderedView(mixins.ListModelMixin,
                        mixins.UpdateModelMixin,
                        mixins.CreateModelMixin,
                        viewsets.GenericViewSet):
    serializer_class = serializers.ARListSerializer
    queryset = models.AR.objects.filter(is_rendered=False)

    def get_serializer_class(self):
        if self.action == 'list':
            return serializers.ARListSerializer
        elif self.action == 'update':
            return serializers.ARIsRenderedSerializer
        elif self.action == 'create':
            return serializers.ARRenderedPhotoSerializer

    def perform_update(self, serializer):
        code = serializer.validated_data.get("code")

        if code == 0:
            instance: models.AR = self.get_object()
            # instance.owner.email_user("Your AR has been rendered out!",
            #                           "Your AR project is ready to use!")

            instance.is_rendered = True
            instance.save()

            context = {
                'id': instance.id,
                'title': instance.title
            }
            email.ARIsRenderedNotificationEmail(self.request, context).send(settings.ADMIN_EMAILS)
            return instance
        print("An error occured!")

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        # self.perform_create(serializer)
        print(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
