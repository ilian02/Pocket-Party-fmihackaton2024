from .lobby import lobby
import json

class lobbyManager:

    def __init__(self):
        self.lobbies = self.get_current_lobbies()

    def create_lobby(self):
        new_lobby = lobby()
        current_lobbies = self.get_current_lobbies()
        current_lobbies[new_lobby.id] = new_lobby.to_json()

        with open('./main/db.json', 'w') as f:
            json.dump(current_lobbies, f)

        return new_lobby
    
    def delete_lobby(self, id):
        pass

    def get_current_lobbies(self):
        lobbies = {}
        
        with open('./main/db.json') as f:
            lobbies = json.load(f)

        # print(lobbies)
            
        return lobbies
    
    def save_current_lobbies(self):
        with open('./main/db.json', 'w') as f:
            json.dump(self.lobbies, f)