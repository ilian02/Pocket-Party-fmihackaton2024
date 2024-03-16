import random

class lobby():


    def __init__(self):
        self.generate_id()
        self.asteroids = []
        self.ship_x = 0
        self.ship_y = 0
        self.players = []

    def generate_id(self):
        self.id = random.randint(10000, 99999)

    def to_json(self):
        return {'id': self.id, 'asteroids': self.asteroids, 'ship_x': self.ship_x, 'ship_y': self.ship_y, 'players': self.players}