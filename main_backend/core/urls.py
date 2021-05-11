from django.contrib import admin
from django.urls import path, include
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

urlpatterns = [
    path('admin/', admin.site.urls),

    path('', include('homepage.urls')),
    path('ar/', include('ar.urls')),
    path('api/v1/ar/', include("ar.api.urls")),
    path('portfolio/', include("portfolio.urls")),
]

urlpatterns += staticfiles_urlpatterns()
