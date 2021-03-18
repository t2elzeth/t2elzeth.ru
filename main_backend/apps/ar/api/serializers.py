from rest_framework import serializers

from .. import models


class ARListSerializer(serializers.ModelSerializer):
    imagename = serializers.CharField(source="image.name")

    class Meta:
        model = models.AR
        fields = [
            "id", "imagename"
        ]


class ARIsRenderedSerializer(serializers.ModelSerializer):
    code = serializers.IntegerField(write_only=True)

    class Meta:
        model = models.AR
        fields = ["id", "code"]
