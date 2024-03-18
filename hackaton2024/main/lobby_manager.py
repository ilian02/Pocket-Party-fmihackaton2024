from .lobby import lobby

class lobbyManager:

    def __init__(self):
        self.lobbies = {}

    def create_lobby(self):
        new_lobby = lobby()
        self.lobbies[new_lobby.id] = new_lobby
        print(f"Created lobby {new_lobby.id}")
        return new_lobby
    
    def delete_lobby(self, id):
        self.lobbies.popitem(id)

    def get_current_lobbies(self):
        return self.lobbies
    
    def add_user_to_lobby(self, user_id, lobby_id):
        # Add checks
        print(self.lobbies)

        self.lobbies[lobby_id].players.append(user_id)
    
    def remove_user_from_lobby(self, user_id, lobby_id):
        # Add checks
        self.lobbies[lobby_id].players.remove(user_id)

    def move_ship(self, user_id, lobby_id):
        pass

    def get_lobby(self, id):
        return self.lobbies[int(id)]

lobby_manager = lobbyManager()