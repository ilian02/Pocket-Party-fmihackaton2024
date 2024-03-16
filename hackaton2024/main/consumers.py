import json
from channels.generic.websocket import WebsocketConsumer

class ControllerConsumer(WebsocketConsumer):
    
    def connect(self):
        self.accept()

        self.user = self.scope["user"]
        # print(self.user)

        self.send(text_data=json.dumps({
            'type':'connection_establieshed',
            'message': 'you are now connected!'
        }))
    
    def disconnect(self, code):
        return super().disconnect(code)
    
    def receive(self, text_data=None, bytes_data=None):
        # print(text_data)
        # print(bytes_data)
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        print(message)

        
