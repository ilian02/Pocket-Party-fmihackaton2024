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