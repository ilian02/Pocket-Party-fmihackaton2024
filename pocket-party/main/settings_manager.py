import json
import threading
import time
from .lobby import Lobby


class SettingsManager():
    def __init__(self, db_file_url: str) -> None:
        self.db_file_url = db_file_url
        with open(db_file_url, "r") as f:
            self.data = json.load(f)

        if 'lobbies' not in self.data:
            self.data['lobbies'] = dict()
        self.changes = False

        # Create a new thread for writing to the JSON file
        thread = threading.Thread(target=self.write_to_json_file)
        # Set the thread as a daemon so it will exit when the main program exits
        thread.daemon = True
        thread.start()

    def set(self, key: str, value):
        self.data[key] = value
        self.changes = True

    def update_lobby(self, new_lobby: dict):
        lobbies = self.data['lobbies']
        lobbies[new_lobby['id']] = new_lobby
        self.set('lobbies', lobbies)

    def add_new_player(self, user_id: str, user_name: str, lobby_id: str):
        if lobby_id not in self.data['lobbies']:
            raise Exception()
        lobby = self.data['lobbies'][lobby_id]
        lobby['players'].append(
            {"user_id": user_id, "user_name": user_name, "ready": False})

        self.update_lobby(lobby)

    def remove_player(self, user_id: str, lobby_id: str):
        if lobby_id not in self.data['lobbies']:
            return
        lobby = self.data['lobbies'][lobby_id]
        lobby['players'] = [obj for obj in lobby['players']
                            if obj['user_id'] != user_id]

        self.update_lobby(lobby)

    def player_ready(self, user_id: str, lobby_id: str):
        if lobby_id not in self.data['lobbies']:
            return
        lobby = self.data['lobbies'][lobby_id]
        for player in lobby['players']:
            if player['user_id'] == user_id:
                player['ready'] = True
                break  # No need to continue iterating once player is found

        self.update_lobby(lobby)

    def create_game(self, lobby_id: str):
        if lobby_id not in self.data['lobbies']:
            raise Exception()
        lobby = self.data['lobbies'][lobby_id]
        games = self.data['games']
        # calculate number of ships based on number of players
        games[lobby_id] = {'game_id': lobby_id, 'ships': [
            {'x': 0, 'y': 0}], 'players': lobby['players']}
        self.set('games', games)

    def delete_lobby(self, lobby_id: str):
        lobbies = self.data['lobbies']
        del lobbies[lobby_id]
        self.set('lobbies', lobbies)

    def write_to_json_file(self):
        while True:
            if self.changes:
                with open(self.db_file_url, "w") as f:
                    # Write data to JSON file
                    json.dump(self.data, f, indent=4)
                print("Data written to JSON file")
                self.changes = False
            time.sleep(5)  # Sleep for 5 seconds


settings_manager = SettingsManager('./db.json')
