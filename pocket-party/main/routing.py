from django.urls import re_path
from . import consumers

websocket_urlpatterns = {
    re_path(r'ws/lobby/(?P<lobby_id>[^/]+)',
            consumers.LobbyConsumer.as_asgi()),
    re_path(r'ws/controller/(?P<game_id>[^/]+)',
            consumers.ControllerConsumer.as_asgi()),
    re_path(r'ws/game/(?P<game_id>[^/]+)',
            consumers.GameConsumer.as_asgi()),
}
