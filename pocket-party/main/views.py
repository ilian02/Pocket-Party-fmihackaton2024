import random
from django.shortcuts import render, redirect
from .lobby_manager import lobby_manager
from django.http import Http404
from .settings_manager import settings_manager


def index(request):
    return render(request, 'index.html')


def lobbies(request):
    if request.method == 'POST':
        lobby = lobby_manager.create_lobby()
        return redirect(f"waitroom/{lobby.id}")
    lobbies = list(lobby_manager.get_current_lobbies().values())
    return render(request, 'lobbies.html', {'lobbies': lobbies})


def controller(request, game_id: str):
    user_id = random.randint(10000, 1000000)
    user_name = request.POST.get('user_name')
    return render(request, 'controller.html', {'user_id': user_id, 'user_name': user_name, 'game_id': game_id})


def waitroom(request, lobby_id: str):
    if not lobby_id in lobby_manager.get_current_lobbies():
        raise Http404(f"Lobby with that id does not exist")
    lobby = lobby_manager.get_current_lobbies()[lobby_id]
    return render(request, 'waitroom.html', {"lobby": lobby})


def play_cosmic_co_pilot(request, game_id: str):
    settings_manager.create_game(game_id)
    settings_manager.delete_lobby(game_id)
    return render(request, 'cosmic_co_pilot.html', {'game_id': game_id})
