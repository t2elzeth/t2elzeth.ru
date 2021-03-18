from django.shortcuts import render
from django.views.generic.base import View


class HomepageView(View):
    def get(self, request):
        return render(request, 'homepage/index.html')
