
document.addEventListener("DOMContentLoaded", function() {
    // on content loaded
// start function listening to post interactions
    interact_post()
    });

// const Post = {

// }

function  interact_post(){

    // from the getCookie funciton, return the value for 'csrftoken'
    const csrftoken = getCookie('csrftoken');



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

        const like = post.querySelector('.like-btn');
        like.onclick = () => {
            // if user authenticated the btn passes the value for post.id, else, is greyed button with no action
            if (like.value){
                fetch(`/like`, {
                    method: "PUT",
                    headers: {'X-CSRFToken': csrftoken,
                    "Content-Type": "application/json"
                },
                    mode: 'same-origin',
                    body: JSON.stringify({
                        post_id : like.value
                    })
                }).then((response) => response.json())
                .then((data) =>{
                    // you also have access to data["message"] with liked/unliked post"

                    document.querySelector(".counter").innerText = data['postLikes'] /*or data.postLikes */
                    // ternary for button change
                    // TODO change to icon
                    if (data.message === "liked" ? like.innerHTML = "&lt;/3" : like.innerHTML= "&lt;3");

                });
            };


        }


    });

};


// this function from django docs scans the cookies and returns a cookieValue dictionary
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}






// ========= old code =======
// prima cercavo di selezionare tutti i like button per accedere alle funzioni del post, ma è meglio selezionare ogni post e dentro li accedere ai suoi btn tra cui like, comment e history
// select all like buttons class
//  const like_btns = document.querySelectorAll('.like-btn')
 // loop over every button and for each set the function (for of/foreach accesses the object element, not just the index) https://thecodebarbarian.com/for-vs-for-each-vs-for-in-vs-for-of-in-javascript
//  like_btns.forEach(like => like.onclick = like_toggle);