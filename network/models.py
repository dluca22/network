from unittest.util import _MAX_LENGTH
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    # quotes on User because is self referenced / but quotes used for models defined later
    follow = models.ManyToManyField("User", blank=True, related_name="followers")
    # male/female?
    # avatar/image
    # interests?
    # follower
    # following

    # notifications ????
    # email private??
    pass

# class Profile(models.Model):
#     user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
#     bio = models.CharField(max_length=200, blank=True)
#     followers = models.ManyToManyField('Profile',related_name="followers_profile", blank=True, symmetrical=False)
#     following = models.ManyToManyField('Profile', related_name="following_profile", blank=True, symmetrical=False)
#     # avatar_thumbnail = ProcessedImageField(upload_to='profile_images',
#     #                                     processors=[ResizeToFill(320, 320)],
#     #                                     format='JPEG',
#     #                                     options={'quality': 40},
#     #                                     blank=True)
#     pass


class Post(models.Model):
    """model for posts by user, each post is by a User_FK, has text, has Likes_m2m, has comments_FK, has History of text_FK
        #show list of people liking?"""
    id = models.BigAutoField(primary_key=True)
    op = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField(max_length=250)
    timestamp= models.DateTimeField(auto_now=True)
    # likes = models.ForeignKey(Like,) no, i thing must be related name
    # comments = i think must be related name
    # history = related name

    # while editing have a save btn but also a cancel edit button

    # category??
    # picture/image??
    pass



# class Follow(models.Model):
    # table (m2m?) linking an user to another, an user cannot follow self, but can follow others
    # follower_id
    # followee_id
    # pass

class Comment(models.Model):
    # class for comments to post
    id = models.BigAutoField(primary_key=True)
    text = models.TextField(max_length=250)
    timestamp= models.DateTimeField(auto_now=True)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)


    pass


class Like(models.Model):
    # model for likes to posts
    id = models.BigAutoField(primary_key=True)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    pass


class History(models.Model):
    # model for history of edits to Post text and Comment text
    id = models.BigAutoField(primary_key=True)
    old_text = models.TextField(max_length=250)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    # comment_id (would id conflic?? maybe 2 models for CommentHistory and PostHistory)

    pass


# ======= others ========
# class Interests(models.Model):
    # model for various categories of Interest that people might follow
    # has preset set of keywords?
    # is it useful if no algorithm in place?
    # pass

# class Category(models.Model):
    # model for set of categories a post might fall under??
    # maybe linked to user interests?
    # pass