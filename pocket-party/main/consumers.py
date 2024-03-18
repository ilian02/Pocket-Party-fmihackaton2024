import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer
from .settings_manager import settings_manager


class LobbyConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.lobby_id = self.scope['url_route']['kwargs']['lobby_id']
        self.lobby_group_name = f"lobby_{self.lobby_id}"

        # Join lobby group
        await self.channel_layer.group_add(
            self.lobby_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, _):
        await self.channel_layer.group_discard(
            self.lobby_group_name,
            self.channel_name
        )

    async def receive(self, text_data=None, bytes_data=None):
        data = json.loads(text_data)
        print(data)

    async def player_connected(self, event):
        settings_manager.add_new_player(
            event['user_id'], event['user_name'], self.lobby_id)
        await self.send(text_data=json.dumps({
            'type': 'player_connected',
            'user_id': event['user_id'],
            'user_name': event['user_name'],
        }))

    async def player_disconnected(self, event):
        settings_manager.remove_player(
            event['user_id'], self.lobby_id)
        await self.send(text_data=json.dumps({
            'type': 'player_disconnected',
            'user_id': event['user_id'],
        }))

    async def player_ready(self, event):
        settings_manager.player_ready(
            event['user_id'], self.lobby_id)
        await self.send(text_data=json.dumps({
            'type': 'player_ready',
            'user_id': event['user_id'],
        }))


class ControllerConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.game_id = self.scope['url_route']['kwargs']['game_id']
        self.controller_group_name = f"controller_for_{self.game_id}"

        # Join lobby group
        await self.channel_layer.group_add(
            self.controller_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, _):
        await self.channel_layer.group_discard(
            self.controller_group_name,
            self.channel_name
        )
        await self.channel_layer.group_send(
            f"lobby_{self.game_id}",
            {
                'type': 'player_disconnected',
                'user_id': self.user_id,
            }
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        print(data)

        event_type = data.get('type')

        if event_type == 'controller_connected':
            self.user_id = data['user_id']
            channel_layer = get_channel_layer()
            await channel_layer.group_send(
                f"lobby_{self.game_id}",
                {
                    'type': 'player_connected',
                    'user_id': data['user_id'],
                    'user_name': data['user_name'],
                }
            )
        elif event_type == 'ready':
            channel_layer = get_channel_layer()
            await channel_layer.group_send(
                f"lobby_{self.game_id}",
                {
                    'type': 'player_ready',
                    'user_id': data['user_id'],
                }
            )
        elif event_type == 'key_up':
            channel_layer = get_channel_layer()
            await channel_layer.group_send(
                f"game_{self.game_id}",
                {
                    'type': 'key_up',
                    'direction': data['direction'],
                }
            )
        elif event_type == 'key_down':
            channel_layer = get_channel_layer()
            await channel_layer.group_send(
                f"game_{self.game_id}",
                {
                    'type': 'key_down',
                    'direction': data['direction'],
                }
            )


class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.game_id = self.scope['url_route']['kwargs']['game_id']
        self.game_group_name = f"game_{self.game_id}"

        await self.channel_layer.group_add(
            self.game_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, _):
        await self.channel_layer.group_discard(
            self.game_group_name,
            self.channel_name
        )

    # not used for now
    async def receive(self, text_data):
        data = json.loads(text_data)
        print(data)

        # event_type = data.get('type')

        # if event_type == '':
        #     pass

    async def key_up(self, event):
        await self.send(text_data=json.dumps({
            'type': 'keyUp',
            'direction': event['direction']
        }))

    async def key_down(self, event):
        await self.send(text_data=json.dumps({
            'type': 'keyDown',
            'direction': event['direction']
        }))
