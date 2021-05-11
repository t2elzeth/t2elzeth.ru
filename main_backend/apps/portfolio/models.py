from django.db import models


class PortfolioItem(models.Model):
    title = models.CharField(max_length=255)
    url = models.URLField()
    description = models.TextField()

    def __str__(self):
        return f"{self.title}"
