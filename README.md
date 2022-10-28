# cs50-w Network

This is my implementation for [pset4 network](https://cs50.harvard.edu/web/2020/projects/4/network/) for cs50-web bootcamp from Harvard.

## Description:

It is a social network simulation in the tracks of how Twitter was set up.

It is built using the Django framework for the server side, using a simple sqlite database, there are 3 models defining the web app: User, Post and History.

Likes for posts are defined as a many to many relationship with user, while the post history lives in a separate table with a Foreign Key reference to the post.

## Behaviour:

I've allowed Anonymous users to browse the index page of the website without requiring a login/registration;
An anonymous user can browse all posts from the main page, and watch the post edit history, but cannot add a post nor interact with the like button, brute forcing that via developer tools in the console, would still guide the unauthorized user to the login page.

As an user logs in the navbar will expand, including links to his own profile page and his following feed, where only posts from the user he's following will show up, while his own profile page will just display user's own posts.

Every view also has pagination, using Django Paginator manager, dividing every page in 10 posts each.

An authenticated user can now post in the main page, null posts are rejected and post length is limited to 140 characters in the Post model, bruteforcing that will still be rejected by Django validator.

New posts will be displayed on top, posts are sorted in reverse chronological order by id.

A registered user can see his own posts having 2 more options in comparison to other user's posts, he will be able to delete or edit his own posts.

On deletion user will be presented with a confirmation box to avoid accidental triggers

Editing will display a textarea in place of the post's text, pre filled with the previous text content, the character limit is still set to 140 characters, and bruteforcing the page's html via the page inspector, even though will allow a longer text to be inserted, on submission, the django route function will still slice the text up to 140 characters and save only the valid part.

If the edited text is valid, before commiting the update to the post text in the database, a row in the History table will be inserted with the foreign key to the post_id that will store the previous text content of the post and then updating the Post text to the new value.

A json response is then sent to the client side javascript function that will handle the asyncronous update of the post element without requiring a page refresh.

Forgery of the post edit is also handled via the django view function that will send back an error response if the user requesting the edit is not the post owner, and the body of the post will now display an unauthorized error.

Posts without any history reference in the History table will have a disabled history button;
Editing the post with a blank text, or without changing the current text of the post, won't trigger an update of the Post entry, so the history button will still be disabled and no History reference will be created.

Upon correct edit validation, the Json response will also trigger the client side javascript to now activate the history button for the post.

On click of the post's history button an async get request is sent to the server's API to get the content of the post's related History entries, fetching all its related values and sending to the client all the post's previous text content.

Javascript's behaviour handles the post text's manipulation in a safe way using the node's textContent instead of its innerHTML in order to prevent script injection.

Although the styling of the page is nothing to catch eyes it is simple and uncluttered, it is just a proof of concept to spin up and easy to edit or add functions.

In future iterations for my own interest and study i plan on adding other functions like comments to posts, and user profile customization.

I already added some content addressing the addition I'd like to add, like an user dashboard to handle the edit of the profile picture, the user's bio, and the user password update.
