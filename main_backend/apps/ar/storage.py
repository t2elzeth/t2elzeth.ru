import os

from django.conf import settings
from django.core.files.storage import FileSystemStorage


class ImageStorage(FileSystemStorage):
    def path(self, name):
        return os.path.join(settings.BASE_DIR, "..", "nft-generator", "main_backend_images", name)
