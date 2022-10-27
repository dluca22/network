from unittest.util import _MAX_LENGTH
from django.contrib.auth.models import AbstractUser
from django.db import models

# ===============================================================
class User(AbstractUser):
    id = models.BigAutoField(primary_key=True)
    # quotes on User because is self referenced / but also quotes used for models defined later
    follow = models.ManyToManyField("User", blank=True, related_name="followers")

    @property
    def n_friends(self):
        """num of people user follows"""
        return self.follow.count()

    @property
    def friends(self):
        """ returns list of people user is following"""
        return self.follow.all()

    @property
    def n_follower(self):
        """ num of people following user"""
        return self.followers.count()


    def likes(self, post_id):
        """ user.likes(post.id) returns true if user has instance of like on this post"""
        try:
            self.liked.get(id=post_id)
            return True
        except:
            return False

    pass
# ===============================================================

class Post(models.Model):
    """model for posts by user, each post is by a User_FK, has text, has Likes_m2m, has comments_FK, has History of text_FK
        #show list of people liking?"""
    id = models.BigAutoField(primary_key=True)
    op = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")
    text = models.TextField(max_length=140, null=False)
    timestamp= models.DateTimeField(auto_now=True)
    like = models.ManyToManyField("User", blank=True, related_name="liked")

    def __str__(self):
        return f'{self.op.username}: {self.text}'

    @property
    def n_likes(self):
        return self.like.count()
    @property
    def has_history(self):
        return self.history.count()
    @property
    def history(self):
        return self.history.all()

    @property
    def liking(self):
        """return qset of users liking"""
        return self.like.all()

   
    pass

# ===============================================================

class History(models.Model):
    # model for history of edits to Post text and Comment text
    id = models.BigAutoField(primary_key=True)
    old_text = models.TextField(max_length=250)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="history")
    # comment_id (would id conflic?? maybe 2 models for CommentHistory and PostHistory)

    def __str__(self):
        return f"post {self.post.id}, {self.old_text}"


    @property
    def serialized(self):
        return {
            "id":self.id,
            "old_text": self.old_text
        }
    pass
