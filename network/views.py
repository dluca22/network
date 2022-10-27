from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse

from django import forms
from django.core.paginator import Paginator
from django.forms import ModelForm

import json
from .models import Post, User, History


class CreatePost(ModelForm):
    class Meta:
        model = Post
        fields = ('text',)
    #   widget to manipulate area https://docs.djangoproject.com/en/4.1/ref/forms/widgets/#django.forms.Widget.attrs
        widgets = {
          'text': forms.Textarea(attrs={'rows':4, "placeholder":"Post something..."}),
        }




def index(request):
    """
    main page is homepage where all posts are shown by all users, no restriction
    implement as a card the structure with {%include%}
    """
    # creates the form from ModelForm
    post_form = CreatePost()

    # get all posts reverse order and paginates it
    posts = Post.objects.all().order_by('-id')
    paginator = Paginator(posts, 10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    # sends the POST form and the paginator object
    context = {'post_form':post_form, 'page_obj': page_obj }

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
        POST registers the post after processing
        """
    if request.method == 'POST':
        post = CreatePost(request.POST)
        # if is valid, add owner from request and save
        if post.is_valid():
            post.instance.op = request.user
            post.save()

# send response status not redirect
    return HttpResponseRedirect(reverse('index'))


# not login requried because i added a page section to deal with that in the template
def user_page(request, profile_id):
    """
    user's profile page, both own or another's
    if own, hide follow btn, show dashboard btn (REMOVED)
    """
    # gets posts whose owner is profile_id
    try:
        user = User.objects.get(id=profile_id)
        user_posts = user.posts.all().order_by('-id')
    except:
        # if user doesn't exist pass blak value and triggers error in template
        user= None
        user_posts=[]

    # if user exists, paginator formats result
    paginator = Paginator(user_posts, 10)
    page_number= request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    context = {'profile': user, "page_obj": page_obj}
    return render(request, 'network/user_page.html', context=context)


# ajax request as DELETE method to delete the post and send back jsonresponse
def delete_post(request):
    if request.method == "DELETE":
        # from the request transformed to json get the post_id and looks in db
        data = json.loads(request.body)
        post_id = data.get('post_id')
        post = Post.objects.get(id=post_id)

        # server side checking request user is owner
        if request.user == post.op:
            post.delete()
            return JsonResponse({"message":"deleted"}, status = 200)
        else:
            return JsonResponse({"error":"You are not the post owner"}, status = 403)

def edit(request):
    """
    receives ajax request with textarea value and updates the db entry
    """
    if request.method == "POST":
        # get data from json request
        data = json.loads(request.body)
        # get the new_text cut after 140 if forged, strip empty space
        new_text = data.get('new_text').strip()[:140]

        post_id = data.get('post_id')
        post = Post.objects.get(id=post_id)

        # if new_text not empty AND not equal to previous text
        if new_text and new_text != post.text:
            # if valid, creates a copy of the old text in the History table
            History.objects.create(old_text=post.text, post=post)
            # updates Post.text and saves
            post.text = new_text
            post.save()

            return JsonResponse({"message": 'edit saved', "post_text": post.text}, status=200)
        else:
            return JsonResponse({"message": 'not edited'}, status=200)
    else:
            return JsonResponse({"error": 'only POST request accepted'}, status=400)


def history(request, post_id):
    """
    from get request retrieves sends list with history of all post's edits
    """

    history = History.objects.filter(post=post_id)
    return JsonResponse([h.old_text for h in history], safe=False)


def like(request):
    """
    allows an user to like a post or comment
    """
    if request.method == "PUT":

        data = json.loads(request.body)

        post_id = data.get('post_id')
        post = Post.objects.get(id=post_id)
        # if user is already liking trigger action and return JsonResponse + msg
        if request.user in post.liking:
            # remove like record
            post.like.remove(request.user)
            return JsonResponse({"message": "unliked", "postLikes": post.n_likes}, status=206)
        else:
            # add like record
            post.like.add(request.user)
            return JsonResponse({"message": "liked", "postLikes":post.n_likes}, status=206)
    # jsonresponse returns succes 206 meaning only partial data are being sent, also 201 might work, 200 def works, while 204 DOES NOT send back json response datas

    # elif request.method == "GET": ?????????????????????????????
    #     liked_posts = request.user.liked.values()
    #     print("liked_posts")
    #     print(liked_posts)
    #     # return JsonResponse({"liked": liked_posts }, status=200)

    #     return JsonResponse({"error": "only GET and PUT requests are accepted."}, status=200)

    # if not PUT, return error
    else:
        return JsonResponse({"error": "only PUT requests are accepted."}, status=400)

    pass

@login_required(login_url="/login")
def following_feed(request):
    """
    view to display all posts from people an user follows
    """
# get qset of friends of user (who user follows)
    friends = request.user.friends

# set dict and for each friend get friend post, if present, append to dict
    friends_posts = []
    for friend in friends:
        # must be .all() for queryset instead of .values() for dictionary
        posts = friend.posts.all().order_by('-id')
        if posts:
            for post in posts:
                friends_posts.append(post)

    paginator = Paginator(friends_posts, 10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    context = {'page_obj': page_obj, "friends":friends}

    return render(request, 'network/following.html', context=context)


def follow(request):
    """
    allows user to follow another
    """
    if request.method == "PUT":
        data= json.loads(request.body)
        profile_id = data.get("profile_id")
        profile = User.objects.get(id=profile_id)

        # if profile already in user's friends, remove, else add and sends new follower count
        if profile in request.user.friends:
            request.user.follow.remove(profile)
            return JsonResponse({"msg": "removed", "n_followers": profile.n_follower}, status=200)
        else:
            request.user.follow.add(profile)
            return JsonResponse({"msg": "added", "n_followers": profile.n_follower}, status=200)



def user_dashboard():
    """
    OUT OF SCOPE for this pset
    from userpage get access to the dasboard view, where user can change password, delete account, change profile picture, change username, change email
    """
    pass

def comment():
    """
    OUT OF SCOPE for this pset
    comment to one post
    """
    pass