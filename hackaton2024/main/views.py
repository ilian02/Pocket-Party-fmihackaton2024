import random
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
    return render(request, 'lobbies_library.html', {'lobbies': lobbies})

def join_lobby(request):
    # print(request.POST.get('lobby_id'))
    user_id = random.randint(10000, 1000000)
    # print(user_id)
    # print(request.POST.get('lobby_id'))
    return render(request, 'controlers.html', {'user_id': user_id, 'lobby_id': request.POST.get('lobby_id')})

def create_lobby(request):
    new_lobby = lobby_manager.create_lobby()
    lobbies = lobby_manager.get_current_lobbies()
    return render(request, 'host_screen.html', {'lobbies': lobbies, 'lobby_id': new_lobby.to_json()['id']})

def leave_lobby(request):
    print("leaving the lobby")
    print(request.POST.get('user_id'))
    print(request.POST.get('lobby_id'))

    # Remove the player from the 
    lobbies = lobby_manager.get_current_lobbies()
    return render(request, 'lobbies_library.html', {'lobbies': lobbies})

def waitroom(request):
    return render(request, 'waitroom.html', {'waitroom': waitroom})

    