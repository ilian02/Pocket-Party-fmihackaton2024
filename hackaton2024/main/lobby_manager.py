from .lobby import lobby

class lobbyManager:

    def __init__(self):
        self.lobbies = {}

    def create_lobby(self):
        new_lobby = lobby()
        self.lobbies[new_lobby.id] = new_lobby

        return new_lobby
    
    def delete_lobby(self, id):
        self.lobbies.popitem(id)

    def get_current_lobbies(self):
        return self.lobbies
    
    def add_user_to_lobby(self, user_id, lobby_id):
        # Add checks
        self.lobbies[lobby_id].players.add(user_id)
    
    def remove_user_from_lobby(self, user_id, lobby_id):
        # Add checks
        self.lobbies[lobby_id].players.remove(user_id)

    def move_ship(self, user_id, lobby_id):
        pass

lobby_manager = lobbyManager()