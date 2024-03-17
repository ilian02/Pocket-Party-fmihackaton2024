import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

class ControllerConsumer(AsyncWebsocketConsumer):
    
    async def connect(self):
        await self.channel_layer.group_add(
            'source_group',
            self.channel_name
        )
        await self.accept()
    
    async def disconnect(self, code):
        await self.channel_layer.group_discard(
            'source_group',
            self.channel_name
        )
    
    async def receive(self, text_data=None, bytes_data=None):
        data = json.loads(text_data)
        event_type = data.get('event_type')
        if event_type:
            # Trigger an event for the listener consumer
            await self.channel_layer.group_send(
                'listener_group',
                {
                    'type': 'send_message_to_listener',
                    'event_type': event_type,
                    'message': data.get('message')
                }
            )

class ScreenConsumer(AsyncWebsocketConsumer):
    
    async def connect(self):
        await self.channel_layer.group_add(
            'listener_group',
            self.channel_name
        )
        self.accept()

    
    async def disconnect(self, code):
        return super().disconnect(code)
    
    async def receive(self, text_data=None, bytes_data=None):
        pass

    async def send_message_to_listener(self, event):
        # This method is called when an event is triggered by sender consumers
        await self.send(text_data=json.dumps({
            'event_type': event['event_type'],
            'message': event['message']
        }))



# channel_layer = get_channel_layer()
# async_to_sync(channel_layer.group_send)(
#     'source_group',
#     {
#         'type': 'send_message_to_clients',
#         'message': 'Hello, clients!'
#     }
#)
