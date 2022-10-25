# Specification

https://cs50.harvard.edu/web/2020/projects/4/network/

1. ~~New post~~
    ~~signed in users write a post by filling text area then submit~~
    ~~* new post can either be a box on top of the homepageview like Facebook or other page~~

2. ~~All Posts > from ALL users order by recent~~
    ~~* Posts include [username OP, post body, timestamp, number likes]~~
3. Profile Page
    ~~by clicking on username~~
    ~~* display num of followers & number of people user follows~~
   ~~ * all posts of this user in recent order~~
    * if other person profile, btn that display Follow/UnFollow
4.~~ Following > page from ALL users followed~~
    ~~* only signed in users~~
    ~~* toggle follow/unfollow~~

~~5. Pagination~~
    ~~display 10 at a time, then after 10, a Next> btn for second page~~
    ~~* after second page must be 2 btns <Previous||Next>~~
~~6. Edit Posts~~
    ~~* user can edit own posts with edit button, then the body of post, replaced with textarea precompiled~~
    ~~* save post without refreshing page with JavaScript~~
    ~~* be sure anothe user can't edit other user's posts~~
7.~~ Like / Unlike~~
   ~~ w/ javascript asynconously update the like count via fetch, w/o refresh~~ (1,5 days)


## Hints

* For examples of JavaScript fetch calls, you may find some of the routes in Project 3 useful to reference.
* You’ll likely need to create one or more models in network/models.py and/or modify the existing User model to store the necessary data for your web application.
* Django’s Paginator class may be helpful for implementing pagination on the back-end (in your Python code).
* Bootstrap’s Pagination features may be helpful for displaying pages on the front-end (in your HTML).
