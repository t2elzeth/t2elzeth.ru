import os

from django import forms
from django.core.exceptions import ValidationError

from .models import AR


class AddARForm(forms.ModelForm):
    class Meta:
        model = AR
        fields = ["title", "image", "video", "slug"]

    ALLOWED_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png"]

    def __init__(self, *args, **kwargs):
        self._user = kwargs.pop("user")
        super().__init__(*args, **kwargs)

    @staticmethod
    def valid_extension(filename, possible_extensions):
        _, file_ext = os.path.splitext(filename)
        return file_ext.lower() in possible_extensions

    def clean_image(self):
        image = self.cleaned_data["image"]
        if not self.valid_extension(image.name, self.ALLOWED_IMAGE_EXTENSIONS):
            allowed_extensions_message = "or".join(
                self.ALLOWED_IMAGE_EXTENSIONS
            )
            raise ValidationError(
                "Invalid image type. Should be " + allowed_extensions_message
            )
        return image

    def save(self, commit=True):
        instance = super().save(commit=False)
        instance.owner = self._user
        instance.save()
        return instance
