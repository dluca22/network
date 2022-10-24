
from django.urls import path

from . import views

# app_name = 'network'

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("following", views.following, name="following"),
    path("follow", views.follow, name="follow"),
    path("like", views.like, name="like"),
    path("post", views.post, name="post"),
    path("user/<int:id>", views.user_page, name="user"),
]
