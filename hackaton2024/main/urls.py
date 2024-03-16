from django.urls import path
from .views import lobbies, join_lobby, create_lobby

urlpatterns = [
    path('', lobbies),
    path('join_lobby', join_lobby),
    path('create_lobby', create_lobby)
] 