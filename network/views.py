from tkinter import E
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.forms import ModelForm
from django import forms

from .models import *

class CreatePost(ModelForm):
    class Meta:
        model = Post
        fields = ('text',)
    #   widget to manipulate area https://docs.djangoproject.com/en/4.1/ref/forms/widgets/#django.forms.Widget.attrs
        widgets = {
          'text': forms.Textarea(attrs={'rows':4}),
        }




def index(request):
    """
    main page is homepage where all posts are shown by all users, no restriction
    implement as a card the structure with include, that has body, like button, n likes, username, comments, and timestamp as xyz_time_ago, and edit btn, and history show
    """
    post_form = CreatePost()


    context = {'post_form':post_form, 'posts': Post.objects.all().order_by('-id')}

    return render(request, "network/index.html", context=context)


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

@login_required
def post(request):
    """function to register post by user
        GET request shows the format of the modelForm
        POST registers the post after processing
        """
    if request.method == 'POST':
        post = CreatePost(request.POST)
        if post.is_valid():
            post.instance.op = request.user
            post.save()


    return HttpResponseRedirect(reverse('index'))


# not login requried because i added a page section to deal with that in the template
def user_page(request, id):
    """
    user's profile page, both own or another's
    if own, hide follow btn, show dashboard btn
    show n people following
    show n followers
    show all posts descending order
    """
    user_posts = Post.objects.filter(op=id).order_by('-id')
    user_profile = User.objects.filter(id=id).first()
    print(user_profile)
    context = {'profile': user_profile, "posts": user_posts}
    return render(request, 'network/user_page.html', context=context)



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

def like(request, post_id):
    """
    allows an user to like a post or comment
    """
    if request.method == "PUT":
        post = Post.objects.get(id=post_id)
        # if user is already liking trigger action and return JsonResponse + msg
        if request.user.likes(post_id):
            print("AAAA")
            # remove like record
            Like.objects.filter(user=request.user, post=post).delete()
            return JsonResponse({"success": "unliked post."}, status=204)
        else:
            print("AAAA")
            # add like record
            Like.objects.create(user=request.user, post=post)
            return JsonResponse({"success": "liked post."}, status=204)
    # if not POST, return error
    else:
        return JsonResponse({"error": "POST request requiredddddd."}, status=400)

    pass

@login_required(login_url="/login")
def following(request):
    """
    view to display all posts from people an user follows
    """

    friends = request.user.friends
    friends_posts = []
    for person in friends:
        posts = Post.objects.filter(op=person).order_by('-id')
        if posts:
            for post in posts:
                friends_posts.append(post)
    context = {'posts':friends_posts}

    return render(request, 'network/following.html', context=context)

# def follow():
#     """
#     allows user to follow another
#     don't know if via django or Js yet
#     """
#     pass

