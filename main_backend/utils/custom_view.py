from django.views.generic.base import View
from django.shortcuts import render


class CustomARProjView(View):
    context = dict()

    def get(self, request):
        return render(request, 'ar/custom-project.html', context=self.context)

    def __init_subclass__(cls, **kwargs):
        context = getattr(cls, 'context')
        if not context:
            raise AttributeError(f"{cls}'s `context` attribute must be declared")

        if 'title' not in context:
            context.update({'title': 'Custom AR project'})
        if 'video' not in context:
            raise KeyError(f"{cls}'s `context` attribute must have key `video`")
        if 'fset' not in context:
            raise KeyError(f"{cls}'s `context` attribute must have key `fset`")

        return super().__init_subclass__(**kwargs)
