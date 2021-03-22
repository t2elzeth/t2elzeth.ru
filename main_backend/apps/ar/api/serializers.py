from rest_framework import serializers

from .. import models


class ARListSerializer(serializers.ModelSerializer):
    imagename = serializers.SerializerMethodField("_imagename")

    def _imagename(self, obj):
        imagepath = obj.image.name
        return imagepath.split('/')[-1]

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


class ARRenderedPhotoSerializer(serializers.Serializer):
    fset = serializers.FileField()
    fset3 = serializers.FileField()
    iset = serializers.FileField()
