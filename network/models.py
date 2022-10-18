from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    # male/female?
    # avatar/image
    # interests?
    # follower
    # following

    # email private??
    pass

class Post(models.Model):
    # model for posts by user, each post is by a User_FK, has text, has Likes_m2m, has comments_FK, has History of text_FK
        #show list of people liking?
    # user FK
    # text
    # likes FK
    # comments FK
    # history FK

    # while editing have a save btn but also a cancel edit button

    # category??
    # picture/image??
    pass

class Category(models.Model):
    # model for set of categories a post might fall under??
    # maybe linked to user interests?
    pass

class Follow(models.Model):
    # table (m2m?) linking an user to another, an user cannot follow self, but can follow others
    # follower_id
    # followee_id
    pass

class Comment(models.Model):
    # class for comments to post
    #comment_text
    #post_ID FK
    #user_id FK
    pass


class Like(models.Model):
    # model for likes to posts (m2m field?)
    # post_id/comment_id?
    # user_id
    pass


class History(models.Model):
    # model for history of edits to Post text and Comment text
    # old_text
    # post/comment_id (would id conflic?? maybe 2 models for CommentHistory and PostHistory)
    pass

class Interests(models.Model):
    # model for various categories of Interest that people might follow
    # has preset set of keywords?
    # is it useful if no algorithm in place?
    pass