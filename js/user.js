"use strict";

// global to hold the User instance of the currently-logged-in user
let currentUser;

/******************************************************************************
 * User login/signup/login
 */

/** Handle login form submission. If login ok, sets up the user instance */

async function login(evt) {
  console.debug("login", evt);
  evt.preventDefault();

  // grab the username and password
  const username = $("#login-username").val();
  const password = $("#login-password").val();

  // User.login retrieves user info from API and returns User instance
  // which we'll make the globally-available, logged-in user.
  currentUser = await User.login(username, password);

  $loginForm.trigger("reset");
  saveUserCredentialsInLocalStorage();
  updateUIOnUserLogin();
}

$loginForm.on("submit", login);

/** Handle signup form submission. */

async function signup(evt) {
  console.debug("signup", evt);
  evt.preventDefault();

  const name = $("#signup-name").val();
  const username = $("#signup-username").val();
  const password = $("#signup-password").val();

  // User.signup retrieves user info from API and returns User instance
  // which we'll make the globally-available, logged-in user.
  currentUser = await User.signup(username, password, name);

  saveUserCredentialsInLocalStorage();
  updateUIOnUserLogin();

  $signupForm.trigger("reset");
}

$signupForm.on("submit", signup);

/** Handle click of logout button
 *
 * Remove their credentials from localStorage and refresh page
 */

function logout(evt) {
  console.debug("logout", evt);
  localStorage.clear();
  location.reload();
  $allStoriesList.hide();
}

$navLogOut.on("click", logout);

/******************************************************************************
 * Storing/recalling previously-logged-in-user with localStorage
 */

/** If there are user credentials in local storage, use those to log in
 * that user. This is meant to be called on page load, just once.
 */

// hide submit button here
async function checkForRememberedUser() {
  console.debug("checkForRememberedUser");
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  $("#navSubmit").hide();
  if (!token || !username) return false;

  // try to log in with these credentials (will be null if login failed)
  currentUser = await User.loginViaStoredCredentials(token, username);
}

/** Sync current user information to localStorage.
 *
 * We store the username/token in localStorage so when the page is refreshed
 * (or the user revisits the site later), they will still be logged in.
 */

function saveUserCredentialsInLocalStorage() {
  console.debug("saveUserCredentialsInLocalStorage");
  if (currentUser) {
    localStorage.setItem("token", currentUser.loginToken);
    localStorage.setItem("username", currentUser.username);
  }
}

/******************************************************************************
 * General UI stuff about users
 */

/** When a user signs up or registers, we want to set up the UI for them:
 *
 * - show the stories list
 * - update nav bar options for logged-in user
 * - generate the user profile part of the page
 */

//Show submit here for logged in user

function updateUIOnUserLogin() {
  console.debug("updateUIOnUserLogin");
  $("#navSubmit").show();
  $allStoriesList.show();
  updateNavOnLogin();
}

async function addFavorite(e) {
  let user = currentUser.username;
  let box = e.target;
  $(box).attr("checked", true);
  let grabId = $(box).closest("li")[0].id;

  if (e.target.checked) {
    $(box).attr("checked", true);
    arr1.push(grabId);
    await axios({
      url: `https://hack-or-snooze-v3.herokuapp.com/users/${user}/favorites/${grabId}`,
      method: "POST",
      data: {
        token: currentUser.loginToken,
      },
    });
    let addTofavsAuto1 = $(box).closest("li");
    let addTofavsAuto2 = addTofavsAuto1.clone();
    $(".forFavorites").append(addTofavsAuto2);
  } else {
    let $auotRemoveBox = $(".forFavorites").children(`#${grabId}`);
    $auotRemoveBox.remove();
    const myIndex = arr1.indexOf(grabId);
    myIndex > -1 ? arr1.splice(myIndex, 1) : false;

    await axios({
      url: `https://hack-or-snooze-v3.herokuapp.com/users/${user}/favorites/${grabId}`,
      method: "DELETE",
      data: {
        token: currentUser.loginToken,
      },
    });
  }
}

$("body").on("click", ".checkBox", addFavorite);

async function remvoeStory(e) {
  let btn = e.target;
  let forTheFav = $(btn).parents();
  forTheFav = forTheFav[2];

  console.log($(forTheFav).hasClass("stories-list"));

  if ($(forTheFav).hasClass("stories-list")) {
    let closestStory = btn.closest("li");
    let parent = e.target.parentElement;
    let getParent = parent.parentElement;
    getParent.remove();

    closestStory = closestStory.id;

    if (e.target) {
      await axios({
        url: `https://hack-or-snooze-v3.herokuapp.com/stories/${closestStory}`,
        method: "DELETE",
        data: {
          token: currentUser.loginToken,
        },
      });
    }
    location.reload();
  } else if ($(forTheFav).hasClass("forFavorites")) {
    let closestStory = btn.closest("li");
    let parent = e.target.parentElement;
    let getParent = parent.parentElement;
    getParent.remove();

    closestStory = closestStory.id;
    if (e.target) {
      await axios({
        url: `https://hack-or-snooze-v3.herokuapp.com/stories/${closestStory}`,
        method: "DELETE",
        data: {
          token: currentUser.loginToken,
        },
      });
    }
    location.reload();
  }
}

$("body").on("click", ".userBtn", remvoeStory);
