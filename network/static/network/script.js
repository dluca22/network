document.addEventListener("DOMContentLoaded", function () {
  // on content loaded
  // start function listening to post interactions for every page
  interact_post();

  // get document url
  const url = new URL(document.URL);
  // split on "/"", returns ["", "user", "<num>"], so get 1st
  base_path = url.pathname.split("/")[1];
  // if base_path is user, trigger userpage

  // if base url is "user" run userpage()
  if (base_path == "user") {
    userpage();
  }
}); /*end DOMcontentoloaded */

// ===================================================================================

function interact_post() {
  // from the getCookie funciton, return the value for 'csrftoken'

  const posts = document.querySelectorAll(".post-card");

  posts.forEach((post) => {
    hover_style(post);
    // select the post Like btn and launch function listening to onclick
    const like = post.querySelector(".like-btn");
    like_toggle(like, post);

    // select the post Edit btn and launch function listening to onclick
    const edit = post.querySelector(".edit-btn");
    // not every post has edit button, so, IF present, lauch onclick fuction
    if (edit) {
      edit_post(edit, post);
    }
    const del = post.querySelector(".delete-btn");
    if (del) {
      delete_post(del, post);
    }
    const hist = post.querySelector(".history-btn");
    show_history(hist, post);
  }); /*end for each post */
} /* end interact_post()*/

// ===================================================================================

// function to manage userapage both for others and self
function userpage() {
  const follow = document.querySelector(".follow-btn");

  follow_toggle(follow);
}

// ===================================================================================

// this function from django docs scans the cookies and returns a cookieValue dictionary
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// ===================================================================================

function hover_style(post) {
  // just some styling to practice
  // on mouse enter add shadow, on mouse leave removes it
  post.addEventListener("mouseenter", function () {
    post.classList.add("shadow");
  });
  post.addEventListener("mouseleave", function () {
    post.classList.remove("shadow");
  });
}

// ===================================================================================

function like_toggle(like, post) {
  like.onclick = () => {
    // if user authenticated the btn passes the value for post.id, else, is greyed button with no action
    if (like.value) {
      fetch(`/like`, {
        method: "PUT",
        headers: {
          "X-CSRFToken": getCookie("csrftoken"),
          "Content-Type": "application/json",
        },
        mode: "same-origin",
        body: JSON.stringify({
          post_id: like.value,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          // you also have access to data["message"] with liked/unliked post"

          post.querySelector(".badge").innerText =
            data["postLikes"]; /*or data.postLikes */
          // ternary for button change
          // TODO change to icon
          if (
            data.message === "liked"
              ? (like.style.opacity = "95%")
              : (like.style.opacity = "60%")
          );
        }); /*end fetch PUT request like */
    } /*end if like is not greyed out*/
  }; /* end like.onclick */
} /*end of like function abstraction*/

// ===================================================================================

function follow_toggle(follow) {
  // onclick sends put request to follow or unfollow based on being yet a follower or not
  follow.onclick = () => {
    fetch(`/follow`, {
      method: "PUT",
      headers: {
        "X-CSRFToken": getCookie("csrftoken"),
        "Content-Type": "application/json",
      },
      mode: "same-origin",
      body: JSON.stringify({
        // follow button has value of post id and sends to API
        profile_id: follow.value,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // updates the followers counter from API response
        document.querySelector(".n_followers").innerHTML = data.n_followers;
        if (data.msg == "added") {
          follow.innerHTML = "Unfollow";
          follow.classList.replace("btn-success", "btn-warning");
        } else {
          follow.innerHTML = "Follow";
          follow.classList.replace("btn-warning", "btn-success");
        }
      });
    // TODO either change the color with class, or have 2 buttons in userpage toggling hide/block, or use an icon
  };
} /*end of follow function abstraction*/

// ===================================================================================
function edit_post(edit, post) {
  // when edit is clicked create textarea precompiled with old text, on submit send fetch request, then remove text area and display post text
  edit.onclick = () => {
    // after clicking set disabled (while function is in execution), so that multiple click don't keep appending edit text area
    edit.disabled = true;

    // get the current post text and hide it
    const old_text = post.querySelector(".post-text");
    old_text.style.display = "none";

    // div containing the post text
    const post_body = post.querySelector(".post-body");

    // create edit section to add textarea and buttons
    const edit_div = document.createElement("div");
    edit_div.setAttribute("id", "edit-section");

    // textarea has max len of 140(like model)
    const edit_area = document.createElement("TEXTAREA");
    edit_area.setAttribute("name", "edit_area");
    edit_area.setAttribute("maxlength", 140);
    edit_area.setAttribute("rows", 4);
    // gets old text and sets it as precompiled
    const precompiled = document.createTextNode(old_text.innerHTML);
    edit_area.appendChild(precompiled);

    // create save button and append
    let save_edit = document.createElement("BUTTON");
    save_edit.setAttribute("class", "save-edit"); // ICON??
    save_edit.innerText = "Save";
    // create cancel button and append
    let cancel = document.createElement("BUTTON");
    cancel.setAttribute("class", "cancel-edit"); // ICON??
    cancel.innerText = "Cancel";

    // append elements to the edit section
    edit_div.append(edit_area, save_edit, cancel);
    // append the edit section to post body
    post_body.append(edit_div);

    // if cancel is clicked, sets edit_area to null and trigger save that will dismiss the editing
    cancel.onclick = () => {
      edit_area.value = "";
      save_edit.click();
    };

    // if save is clicked
    save_edit.onclick = () => {
      // after saving (finish execution) re enables the edit button, so that it can be clicked again
      edit.disabled = false;
      // if edit_area is null, remove the edit section and display the old text
      if (!edit_area.value || edit_area.value == old_text.innerText) {
        edit_div.remove();
        old_text.style.display = "block";
        return false;
      }
      // else if actually wrote input or didn't click cancel
      else {
        fetch("/edit", {
          method: "POST",
          headers: {
            "X-CSRFToken": getCookie("csrftoken"),
            "Content-Type": "application/json",
          },
          mode: "same-origin",
          body: JSON.stringify({
            new_text: edit_area.value,
            post_id: edit.value,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            // with 200 response remove the edit section either way
            edit_div.remove();
            // if data was saved, set old text to new text value, and set element to display
            if (data.message == "edit saved") {
              // if hist btn was disabled (had no history), set enabled
              document.querySelector(".history-btn").disabled = false;

              old_text.innerHTML = data.post_text;
              old_text.style.display = "block";
            } else if (data.message == "not edited") {
              old_text.style.display = "block";
              return false;
            }
          });
      } //end confitional edit_area NOT null, or cancel NOT clicked
    };
    return false;
  };
} /* end of edit_post */

// ===================================================================================

function delete_post(del, post) {
  del.onclick = () => {
    // on click, hide delete button
    del.style.display = "none";
    // create a span as dialog for delete confirmation with 2 buttons
    const confirm_box = document.createElement("span");
    confirm_box.innerHTML =
      "<span class='confirm-dialog'> Are you sure?\
        <button class='btn btn-success btn-sm rounded-pill' value= true>Yes</button>\
        <button class='btn btn-danger btn-sm rounded-pill' value=false>No</button>\
        </span>";
    // insert dialog span in place of del button (after it but del button is set to hiding)
    del.insertAdjacentElement("afterend", confirm_box);
    let confirm = document.querySelector("[value=true]");
    let dismiss = document.querySelector("[value=false]");

    // if confirm button click, send fetch request
    confirm.onclick = () => {
      fetch("/deletepost", {
        method: "DELETE",
        headers: {
          "X-CSRFToken": getCookie("csrftoken"),
          "Content-Type": "application/json",
        },
        mode: "same-origin",
        body: JSON.stringify({
          post_id: del.value,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          // remove confirm box, otherwise will interfere with next delete
          confirm_box.remove();
          // hide the post removed
          post.style.display = "none";
        });
    }; /* end of confirm click */

    // if delete NOT confirmed show delete button again, remove confirm dialog
    dismiss.onclick = () => {
      del.style.display = "inline";
      confirm_box.remove();
      return false;
    }; /*end of dismiss click */
  }; /*end of del onclick */
} /* end of delete_post()*/

function show_history(hist, post) {
  hist.onclick = () => {
    hist.disabled=true;
    fetch(`/history/${hist.value}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const card = build_card();

        data.forEach((elem) => {
            let li = document.createElement("li");
            li.classList.add("list-group-item","p-1", "justify-content-center");
            li.innerText = elem;
            card.firstChild.append(li);
            const close = card.querySelector('.close-btn')
            close.onclick =() =>{
                card.remove()
                hist.disabled=false;
            }
        });

        hist.insertAdjacentElement("afterend", card)
        // post.insertAdjacentElement("afterend", card)
      });
  };
} /*end of show_history */

function build_card() {
  const card = document.createElement("div");
  card.classList.add("card", "history-card", "flex");
  card.style = "width: 12rem; float: right;";

  const ul = document.createElement("ul");
  ul.classList.add("list-group", "list-group-flush");


  const close = document.createElement("button")
  close.classList.add("close-btn", "justify-content-center", "btn", "btn-sm", "btn-dark")
  close.innerText= "X"
  card.append(ul, close);
  return card;
}

// ========= old code =======
// prima cercavo di selezionare tutti i like button per accedere alle funzioni del post, ma è meglio selezionare ogni post e dentro li accedere ai suoi btn tra cui like, comment e history
// select all like buttons class
//  const like_btns = document.querySelectorAll('.like-btn')
// loop over every button and for each set the function (for of/foreach accesses the object element, not just the index) https://thecodebarbarian.com/for-vs-for-each-vs-for-in-vs-for-of-in-javascript
//  like_btns.forEach(like => like.onclick = like_toggle);
