from .lobby import lobby
import json
import os

class lobbyManager:

    def create_lobby(self):
        new_lobby = lobby()
        current_lobbies = self.get_current_lobbies()
        current_lobbies[new_lobby.id] = new_lobby

        with open('./main/db.json') as f:
            json.dump(current_lobbies, f)

        return new_lobby
    
    def delete_lobby(self, id):
        pass

    def get_current_lobbies(self):
        lobbies = {}
        
        with open('./main/db.json') as f:
            lobbies = json.load(f)
            
        return lobbies