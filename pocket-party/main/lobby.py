import random


class Lobby():
    def __init__(self):
        self.generate_id()
        self.players = []

    def generate_id(self):
        self.id = str(random.randint(1, 99999))

    def to_json(self):
        return {'id': self.id, 'players': self.players, }
