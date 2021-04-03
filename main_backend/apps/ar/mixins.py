from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import HttpResponse


class CustomLoginRequiredMixin(LoginRequiredMixin):
    login_url = '/admin/login/'


class ARIsReadyMixin:
    def has_permissions(self):
        return self.get_object().is_rendered

    def dispatch(self, request, *args, **kwargs):
        if not self.has_permissions():
            return HttpResponse('This AR is not ready yet!')
        return super().dispatch(request, *args, **kwargs)
