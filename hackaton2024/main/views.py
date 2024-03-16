from django.views import View
from django.http import HttpResponse
from django.shortcuts import render
from .lobby import Lobby

def lobbies(request):
    lobbies = [Lobby('Lobby A', 1), Lobby('Lobby B', 2), Lobby('Lobby C', 3)]

    return render(request, 'lobbies.html', {'lobbies': lobbies})

def join_lobby(request):
    return render(request, 'controlers.html')
