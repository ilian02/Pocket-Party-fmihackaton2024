from django.urls import path
from .views import lobbies, join_lobby, create_lobby, index, leave_lobby, waitroom, play

urlpatterns = [
    path('', index, name='index'),
    path('lobbies', lobbies),
    path('join_lobby', join_lobby),
    path('create_lobby', create_lobby),
    path('lobbies_library', create_lobby),
    path('leave_lobby', leave_lobby),
    path('waitroom', waitroom),
    path('cosmic_co-pilot', play)
]