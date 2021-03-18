from django.urls import path

from . import views

urlpatterns = [
    path('', views.AllArView.as_view(), name='all_ar'),
    path('add/', views.AddArView.as_view(), name='add_ar'),
    path('<int:pk>/', views.ArDetailView.as_view(), name='detail_ar'),
    path('<str:project_name>/', views.CustomProjectView.as_view()),
]
