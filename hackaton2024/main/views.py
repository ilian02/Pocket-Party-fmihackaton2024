from django.views import View
from django.http import HttpResponse
from django.shortcuts import render
from .lobby_manager import lobbyManager

lobby_manager = lobbyManager()

def index(request):
    return render(request, 'index.html')

def lobbies(request):
    # lobbies = [lobby('Lobby A', 1), Lobby('Lobby B', 2), Lobby('Lobby C', 3)]
    lobbies = lobby_manager.get_current_lobbies()
    return render(request, 'lobbies.html', {'lobbies': lobbies})

def join_lobby(request):
    return render(request, 'controlers.html')

def create_lobby(request):
    lobby_manager.create_lobby()
    lobbies = lobby_manager.get_current_lobbies()
    return render(request, 'lobbies.html', {'lobbies': lobbies})
    