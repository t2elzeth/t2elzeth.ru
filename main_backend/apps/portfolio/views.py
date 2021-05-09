from django.shortcuts import render
from django.views import View

from . import models


class PortfolioListView(View):
    def get(self, request):
        return render(request, 'portfolio/list.html', self.get_context())

    def get_context(self):
        return {'portfolio_items': models.PortfolioItem.objects.all()}
