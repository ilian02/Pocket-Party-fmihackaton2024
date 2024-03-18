import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer
from .lobby_manager import lobby_manager

class ControllerConsumer(AsyncWebsocketConsumer):
    
    def __init__(self):
        self.role = None

    async def connect(self):
        await self.accept()
    
    async def disconnect(self):
        if self.role == 'screen':
            await self.channel_layer.group_discard(str(self.lobby_id), self.channel_name)
        elif self.role == 'controller':
            await self.channel_layer.group_discard(str(self.lobby_id) + str('_controllers'), self.channel_name)
    
    async def receive(self, text_data=None, bytes_data=None):
        data = json.loads(text_data)
        # print(data)

        event_type = data.get('message_type')
        if event_type == 'connected_controller':
            self.lobby_id = data.get('lobby_id')
            self.user_id = data.get('user_id')
            self.role = 'controller'
            await self.channel_layer.group_add(str(self.lobby_id) + str('_controllers'), self.channel_name)
        elif event_type == 'game_screen_connected':
            self.lobby_id = data.get('lobby_id')
            self.role = 'screen'
            await self.channel_layer.group_add(str(self.lobby_id), self.channel_name)
        elif event_type == 'movement':
            self.direction = data.get('direction')
            self.lobby_id = data.get('lobby_id')

            current = lobby_manager[self.lobby_id]

            if self.direction == 'up':
                current.ship_y -= 7
            if self.direction == 'down':
                current.ship_y += 7
            if self.direction == 'left':
                current.ship_x -= 7
            if self.direction == 'right':
                current.ship_x -= 7

            await self.channel_layer.group_send(
                str(self.lobby_id), {
                'type': 'notify',
                'event_type': 'ship_coordinates',
                'ship_coordinates': [{ 'x': current.ship_x,
                                       'y': current.ship_y}]
            })

    async def notify(self, event):
        await self.send(text_data=json.dumps({
                'event_type': event['event_type'],
                'ship_coordinates': event['ship_coordinates']
        }))