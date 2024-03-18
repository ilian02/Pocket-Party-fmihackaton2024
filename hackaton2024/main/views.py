import random
from django.views import View
from django.http import HttpResponse
from django.shortcuts import render
from .lobby_manager import lobby_manager


def index(request):
    return render(request, 'index.html')

def lobbies(request):
    lobbies = lobby_manager.get_current_lobbies()
    return render(request, 'lobbies_library.html', {'lobbies': lobbies})

def join_lobby(request):
    user_id = random.randint(10000, 1000000)
    lobby_id = int(request.POST.get('lobby_id'))
    lobby_manager.add_user_to_lobby(user_id, lobby_id)
    return render(request, 'controlers.html', {'user_id': user_id, 'lobby_id': lobby_id})

def create_lobby(request):
    lobby = lobby_manager.create_lobby()
    return render(request, 'waitroom.html', {'lobby': lobby})

def leave_lobby(request): 
    user_id = request.POST.get('user_id')
    lobby_id = request.POST.get('lobby_id')
    if lobby_id in lobby_manager.get_current_lobbies():
        lobby_manager.remove_user_from_lobby(user_id, lobby_id)

    return render(request, 'lobbies_library.html', {'lobbies': lobby_manager.get_current_lobbies()})

def waitroom(request):
    lobby_manager.create_lobby()
    return render(request, 'waitroom.html', {'waitroom': waitroom})

def play(request):
    return render(request, 'cosmic_co-pilot.html')

def delete_lobby(request):
    # lobby_id = request.POST.get('lobby_id')
    # lobby_manager.delete_lobby(lobby_id)
    return render(request, 'lobbies_library.html', {'lobbies': lobby_manager.get_current_lobbies()})
