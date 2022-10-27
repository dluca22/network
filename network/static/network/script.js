/*jshint esversion: 6 */
document.addEventListener("DOMContentLoaded", function() {
	// on content loaded
	// start function listening to post interactions for every page
	interact_post();

	// get document url
	const url = new URL(document.URL);
	// split on "/"", returns ["", "user", "<num>"], so get 1st
	const base_path = url.pathname.split("/")[1];
	// if base_path is user, trigger userpage

	// if base url is "user" run userpage()
	if (base_path == "user") {
		userpage();
	}
}); /*end DOMcontentoloaded */

// ===================================================================================

function interact_post() {
	// selects every post-card returning a nodeList
	// for each post Node select every post
	const posts = document.querySelectorAll(".post-card");
	posts.forEach((post) => {
		// adds hover listener for styling shadow
		hover_style(post);

		// select the post "Like btn" and launch function listening to onclick
		// passes the like-button element and the post element
		const like = post.querySelector(".like-btn");
		like_toggle(like, post);

		// select the post Edit btn  and launch function listening to onclick
		// not every post has edit button, so, IF present, lauch onclick fuction
		const edit = post.querySelector(".edit-btn");
		if (edit) {
			edit_post(edit, post);
		}

		// IF post has delete-button listens for clicks
		const del = post.querySelector(".delete-btn");
		if (del) {
			delete_post(del, post);
		}

		// selects history button launch click listener
		const hist = post.querySelector(".history-btn");
		show_history(hist);
	}); /*end for each post */
} /* end interact_post()*/

// ===================================================================================

// function to manage userapage both for others and self
function userpage() {
	// if the page has a follow button, listens for clicks
	const follow = document.querySelector(".follow-btn");
	if (follow) {
		follow_toggle(follow);
	}
}

// ===================================================================================

// just some styling to practice
// on mouse enter add shadow, on mouse leave removes it
function hover_style(post) {
	post.addEventListener("mouseenter", function() {
		post.classList.add("shadow");
	});
	post.addEventListener("mouseleave", function() {
		post.classList.remove("shadow");
	});
}

// ===================================================================================

function like_toggle(like, post) {

	like.onclick = () => {
		// if user authenticated the btn passes the value for post.id, sends value in request.body as post_id
		if (like.value) {
			fetch(`/like`, {
					method: "PUT",
					headers: {
                        // get csrftoken from function
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
                    // with repsonse, updates text of badge counter
					post.querySelector(".badge").innerText = data.postLikes; /*or data['postLikes'] */

                    // (ternary)= if message liked, changes icon opacity, else, resets to default
					if (
						data.message === "liked" ? (like.style.opacity = "95%") : (like.style.opacity = "60%")
					);
				}); /*end fetch PUT Like request */
		} /*end if like is not disabled out*/
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
				// updates the followers counter from API response (not .innerHTML for xss prevention)
				document.querySelector(".n_followers").textContent = data.n_followers;

                if (data.msg == "added") {
					follow.textContent = "Unfollow";
					follow.classList.replace("btn-success", "btn-warning");
				} else {
					follow.textContent = "Follow";
					follow.classList.replace("btn-warning", "btn-success");
				}
			});/*end request call follow */
	};
} /*end of follow function abstraction*/

// ===================================================================================
function edit_post(edit, post) {
	// when edit is clicked create textarea precompiled with old text,
    //on submit send fetch request, then remove text area and display post text
	edit.onclick = () => {
		// after clicking set inputButton disabled (while function IS in execution), so that multiple click don't keep appending edit text area
		edit.disabled = true;

		// selects the current post TEXT and hide it
		const old_text = post.querySelector(".post-text");
		old_text.style.display = "none";

		// div containing the post text
		const text_parent = post.querySelector(".post-body");

		// create edit section to add textarea and buttons
		const edit_div = document.createElement("div");
		edit_div.setAttribute("id", "edit-section");
		edit_div.classList.add("d-flex", "align-items-center");

		// textarea has max len of 140(like model)
		const edit_area = document.createElement("TEXTAREA");
		edit_area.setAttribute("name", "edit_area");
		edit_area.setAttribute("maxlength", 140);
		edit_area.setAttribute("rows", 4);
		// gets old text and sets it as precompiled
		const precompiled = document.createTextNode(old_text.textContent);
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
		text_parent.append(edit_div);

		// if cancel is clicked, sets edit_area to null and trigger save that will dismiss the editing
		cancel.onclick = () => {
			edit_area.value = "";
			save_edit.click();
		};

		// if save is clicked sends POST request
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

							old_text.textContent = data.post_text;
							old_text.style.display = "block";
						} else if (data.message == "not edited") {
							old_text.style.display = "block";
							return false;
						}
					});
			} //end conditional edit_area NOT null, or cancel NOT clicked
		};
		return false;
	};
} /* end of edit_post */

// ===================================================================================

function delete_post(del, post) {
	del.onclick = () => {
		// on click, hide delete button
		del.style.display = "none";

        // instead of create empty element, used documentFragment that will inject the content without the wrapper
		const confirm_fragment = document.createDocumentFragment();

		// create a span as dialog for delete confirmation with 2 buttons and append to Fragment
		let confirmation = document.createElement("span");
		confirmation.classList.add("confirm-dialog");
		confirmation.textContent = "Are you sure? ";
		/*jshint multistr: true */
		confirmation.innerHTML +=
			"<button class='btn btn-success btn-sm rounded-pill' value= true>Yes</button>\
        <button class='btn btn-danger btn-sm rounded-pill' value=false>No</button>";
        confirm_fragment.append(confirmation);

		// insert dialog span in place of del button (after it but del button is set to hiding)
		del.insertAdjacentElement("afterend", confirmation);
		// selects new buttons based on value
        let confirm = post.querySelector("[value=true]");
		let dismiss = post.querySelector("[value=false]");

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
					// must remove confirm box, otherwise will interfere with next delete
					confirmation.remove();
					console.log(data.message);
					// hide the post removed
					post.style.display = "none";
				});
		}; /* end of confirm click */

		// if delete NOT confirmed show delete button again, remove confirm dialog
		dismiss.onclick = () => {
			del.style.display = "inline";
			confirmation.remove();
			return false;
		}; /*end of dismiss click */
	}; /*end of del onclick */
} /* end of delete_post()*/

//============================================================================

function show_history(hist) {
	hist.onclick = () => {
        // disable button while function is in execution
		hist.disabled = true;
        // GET request have no body, so sends post_id via path
		fetch(`/history/${hist.value}`)
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
                // call function to get a history card
				const card = build_card();
                // for each element in the list from data
                // create list node and sets its textcontent to the element
				data.forEach((elem) => {
					let li = document.createElement("li");
					li.classList.add("list-group-item", "p-1", "justify-content-center");
					li.innerText = elem;
					card.firstChild.append(li);

                    //selects the close button of the new card to dismiss the card
                    // re enables the history button
					const close = card.querySelector('.close-btn');
					close.onclick = () => {
						card.remove();
						hist.disabled = false;
					};
				});
                // insert the new card hovering next to hist button
				hist.insertAdjacentElement("afterend", card);
			}); /*end fetch GET request */
	};/*end onclick listener */
} /*end of show_history */

// ===================================================================================
// abstraction function to build a card template for history list popup
function build_card() {
    // setting bootstrap design
	const card = document.createElement("div");
	card.classList.add("card", "history-card", "flex");
	card.style = "width: 12rem; float: right;";

	const ul = document.createElement("ul");
	ul.classList.add("list-group", "list-group-flush");


	const close = document.createElement("button");
	close.classList.add("close-btn", "justify-content-center", "btn", "btn-sm", "btn-dark");
	close.innerText = "X";
	card.append(ul, close);
	return card;
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