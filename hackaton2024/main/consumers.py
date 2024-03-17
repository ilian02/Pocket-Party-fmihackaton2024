import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer
from .lobby_manager import lobbyManager

class ControllerConsumer(AsyncWebsocketConsumer):
    
    async def connect(self):
        await self.accept()
    
    async def disconnect(self, code):
        pass
    
    async def receive(self, text_data=None, bytes_data=None):
        data = json.loads(text_data)
        # print(data)

        event_type = data.get('message_type')
        if event_type == 'connected_controller':
            self.lobby_id = data.get('lobby_id')
            self.user_id = data.get('user_id')
        elif event_type == 'game_screen_connected':
            self.lobby_id = data.get('lobby_id')
            # print('game_screen_connected')
            await self.channel_layer.group_add(str(self.lobby_id), self.channel_name)
            # print(self.channel_layer.groups)
        elif event_type == 'movement':
            self.direction = data.get('direction')
            self.lobby_id = data.get('lobby_id')

            lobby_manager = lobbyManager()
            lobbies = lobby_manager.get_current_lobbies()
            current = None
            # print(lobbies)
            for lobby in lobbies:
                if lobby.id == self.lobby_id:
                    current = lobby
                    break

            if self.direction == 'up':
                current.ship_y -= 7
            if self.direction == 'down':
                current.ship_y += 7
            if self.direction == 'left':
                current.ship_x -= 7
            if self.direction == 'right':
                current.ship_x -= 8

            lobby_manager.save_current_lobbies()

            await self.channel_layer.group_send(str(self.lobby_id), {
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