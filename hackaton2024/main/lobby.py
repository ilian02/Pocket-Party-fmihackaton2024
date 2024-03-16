import random

class lobby():


    def __init__(self):
        self.id = 0
        self.generate_id()
        self.ship_x = 0
        self.ship_y = 0
        self.players = []
        self.shoot = False
        self.crashed = False

    def generate_id(self):
        self.id = random.randint(10000, 99999)

    def to_json(self):
        return {'id': self.id, 'ship_x': self.ship_x, 'ship_y': self.ship_y, 'players': self.players,'shoot': self.shoot, 'crashed': self.crashed}