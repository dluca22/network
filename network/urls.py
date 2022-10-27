
from django.urls import path

from . import views

# app_name = 'network'

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("following", views.following_feed, name="following"),
    path("user/<int:profile_id>", views.user_page, name="user"),
    #routest for fetch requests vv
    path("follow", views.follow, name="follow"),
    path("edit", views.edit, name="edit"),
    path("history/<int:post_id>", views.history, name="history"),
    path("deletepost", views.delete_post, name="delete_post"),
    path("like", views.like, name="like"),
    path("post", views.post, name="post"),
]
