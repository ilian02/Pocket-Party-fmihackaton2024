import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer
from .lobby_manager import lobby_manager

class ControllerConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        await self.accept()
    
    async def disconnect(self, close_code):
        if self.role == 'screen':
            await self.channel_layer.group_discard(str(self.lobby_id), self.channel_name)
        elif self.role == 'controller':
            await self.channel_layer.group_discard(str(self.lobby_id) + str('_controllers'), self.channel_name)
    
    async def receive(self, text_data=None, bytes_data=None):
        data = json.loads(text_data)
        print(f'gettinf data {data}')

        message_type = data.get('message_type')
        if message_type == 'connected_controller':
            self.lobby_id = data.get('lobby_id')
            self.user_id = data.get('user_id')
            self.role = 'controller'

            print(f'Sending cont conn info to {str(self.lobby_id)+str("_waiting")}')

            await self.channel_layer.group_send(
                str(self.lobby_id)+str('_waiting'),
                {
                    'type': 'updatecount',
                    'event_type': 'players_count_changed',
                }
            )

            await self.channel_layer.group_add(str(self.lobby_id) + str('_controllers'), self.channel_name)
        elif message_type == 'game_screen_connected':
            self.lobby_id = data.get('lobby_id')
            self.role = 'screen'
            await self.channel_layer.group_add(str(self.lobby_id), self.channel_name)
        elif message_type == 'waiting_screen_connected':
            print('-------------------------')
            self.lobby_id = data.get('lobby_id')
            self.role = 'waiting_lobby'
            print(str(self.lobby_id)+'_waiting')
            await self.channel_layer.group_add(str(self.lobby_id)+'_waiting', self.channel_name)
        elif message_type == 'movement':
            self.direction = data.get('direction')
            self.lobby_id = data.get('lobby_id')

            current = lobby_manager.get_lobby(self.lobby_id)

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

    async def updatecount(self, event):
        await self.send(text_data=json.dumps({
            'event_type': event['event_type'],
            'count': len(lobby_manager.get_lobby(self.lobby_id).players)
        }))