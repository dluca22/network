
document.addEventListener("DOMContentLoaded", function() {
    // on content loaded
// start function listening to post interactions
    interact_post()
    });

const Post = {
    
}

function  interact_post(){
    // just some styling to practice
    // on mouse enter add shadow, on mouse leave removes it
    const posts = document.querySelectorAll('.post-card');
    posts.forEach(post => {
        post.addEventListener("mouseenter", function () {
                post.classList.add("shadow");
        });
        post.addEventListener("mouseleave", function () {
                post.classList.remove("shadow");
        });

        post.querySelector('.like-btn').onclick = post.like_toggle
    });

};

function like_toggle(post){
    console.log(post)

}



// ========= old code =======
// prima cercavo di selezionare tutti i like button per accedere alle funzioni del post, ma è meglio selezionare ogni post e dentro li accedere ai suoi btn tra cui like, comment e history
// select all like buttons class
 const like_btns = document.querySelectorAll('.like-btn')
 // loop over every button and for each set the function (for of/foreach accesses the object element, not just the index) https://thecodebarbarian.com/for-vs-for-each-vs-for-in-vs-for-of-in-javascript
 like_btns.forEach(like => like.onclick = like_toggle);