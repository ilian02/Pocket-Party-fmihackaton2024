from django.urls import path
from .views import lobbies, controller, index, waitroom, play_cosmic_co_pilot

urlpatterns = [
    path('', index, name='index'),
    path('lobbies', lobbies),
    path('waitroom/<str:lobby_id>', waitroom),
    path('controller/<str:game_id>', controller, name='controller'),
    path('cosmic_co_pilot/<str:game_id>',
         play_cosmic_co_pilot, name='cosmic_co_pilot'),
]
