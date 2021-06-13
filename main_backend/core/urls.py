from django.contrib import admin
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("homepage.urls")),
    path("ar/", include("ar.urls")),
    path("api/v1/ar/", include("ar.api.urls")),
]

urlpatterns += staticfiles_urlpatterns()
