from django import forms
import os

from django.core.exceptions import ValidationError

from .models import AR


class AddARForm(forms.ModelForm):
    class Meta:
        model = AR
        fields = ['title', 'image', 'video']

    ALLOWED_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png"]
    ALLOWED_VIDEO_EXTENSIONS = [".mp4"]

    def __init__(self, *args, **kwargs):
        self._user = kwargs.pop('user')
        super().__init__(*args, **kwargs)

    @staticmethod
    def valid_extension(filename, possible_extensions):
        _, file_ext = os.path.splitext(filename)
        return file_ext in possible_extensions

    def clean_image(self):
        image = self.cleaned_data['image']
        if not self.valid_extension(image.name, self.ALLOWED_IMAGE_EXTENSIONS):
            allowed_extensions_message = 'or'.join(self.ALLOWED_IMAGE_EXTENSIONS)
            raise ValidationError('Invalid image type. Should be ' + allowed_extensions_message)

        return image

    def clean_video(self):
        video = self.cleaned_data['video']
        if not self.valid_extension(video.name, self.ALLOWED_VIDEO_EXTENSIONS):
            allowed_extensions_message = 'or'.join(self.ALLOWED_VIDEO_EXTENSIONS)
            raise ValidationError('Invalid video type. Should be ' + allowed_extensions_message)

        return video

    def save(self, commit=True):
        instance = super().save(commit=False)
        instance.owner = self._user
        instance.save()
        return instance
