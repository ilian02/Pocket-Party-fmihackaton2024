from django.urls import path
from .views import lobbies, join_lobby, create_lobby, index

urlpatterns = [
    path('', index),
    path('lobbies', lobbies),
    path('join_lobby', join_lobby),
    path('create_lobby', create_lobby),
    path('lobbies_library', create_lobby),
]