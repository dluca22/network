from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse

from .models import User


def index(request):
    """
    main page is homepage where all posts are shown by all users, no restriction
    implement as a card the structure with include, that has body, like button, n likes, username, comments, and timestamp as xyz_time_ago, and edit btn, and history show
    """
    return render(request, "network/index.html")


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")


def post():
    """function to register post by user
        GET request shows the format of the modelForm
        POST registers the post after processing

        """
    pass

def profile_page():
    """
    user's profile page, both own or another's
    if own, hide follow btn, show dashboard btn
    show n people following
    show n followers
    show all posts descending order
    """
    pass

def user_dashboard():
    """
    from userpage get access to the dasboard view, where user can change password, delete account, change profile picture, change username, change email
    """
    pass

def comment():
    """
    comment to one post
    """
    pass

def edit():
    """
    edit to a post or a comment, might split this into 2 or give some parameters for context to execute different functions, or might do everything via Js
    """
    pass

def like():
    """
    allows an user to like a post or comment
    """
    pass


def follow():
    """
    allows user to follow another
    don't know if via django or Js yet
    """
    pass