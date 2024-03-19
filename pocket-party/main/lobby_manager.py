from .lobby import Lobby
from .settings_manager import settings_manager


class LobbyManager:
    def create_lobby(self):
        new_lobby = Lobby()
        settings_manager.update_lobby(new_lobby.to_json())

        return new_lobby

    def delete_lobby(self, id):
        self.lobbies.popitem(id)

    def get_current_lobbies(self):
        return settings_manager.data['lobbies']

    def add_user_to_lobby(self, user_id, lobby_id):
        # Add checks
        self.lobbies[lobby_id].players.add(user_id)

    def remove_user_from_lobby(self, user_id, lobby_id):
        # Add checks
        self.lobbies[lobby_id].players.remove(user_id)


lobby_manager = LobbyManager()
