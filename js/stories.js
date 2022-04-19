"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;
let count = 0;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}"><input type="checkbox" class="checkBox">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

function putUserStoriesOnPage() {
  console.debug("putUserStoriesOnPage");

  $ownStories.empty();

  if (currentUser.ownStories.length === 0) {
    $ownStories.append("<h5>No stories added by user yet!</h5>");
  } else {
    // loop through all of users stories and generate HTML for them
    for (let story of currentUser.ownStories) {
      let $story = generateStoryMarkup(story, true);
      $ownStories.append($story);
    }
  }

  $ownStories.show();
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them

  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();

  //loop through favorites and grab the ids, then use ids to grab the checkboxes and set them to checked.
  for (let id of currentUser.favorites) {
    let gettingBoxVal = $(`#${id.storyId}`).children();
    gettingBoxVal = gettingBoxVal[0];
    $(gettingBoxVal).attr("checked", true);
  }

  if (count === 0) {
    for (let id of currentUser.favorites) {
      const gettingBoxVal = $(`#${id.storyId}`);
      const seperateList = gettingBoxVal.clone();
      $(".forFavorites").append(seperateList);
    }
  }
  count++;
  $favorites.hide();

  for (let id of arr1) {
    if (document.getElementById(id)) {
      let autoChecked = document.getElementById(id).children[0];

      autoChecked.setAttribute("checked", true);
    }
  }

  // let liGrab = document.getElementsByClassName("story-user");
  // console.log(liGrab);
  // for (let classElem of liGrab) {
  //   if (classElem.innerHTML === `posted by ${currentUser.username}`) {
  //     $(classElem).append("<button class='userBtn'>Remove User Story</button>");
  //   }
  // }
}

async function addWhenSubmit(e) {
  e.preventDefault();
  let obj = {
    author: $formAuthor.val(),
    title: $formTitle.val(),
    url: $formUrl.val(),
  };

  await storyList.addStory(currentUser, obj);
  putStoriesOnPage();
  putUserStoriesOnPage();

  $formAuthor.val("");
  $formTitle.val("");
  $formUrl.val("");
}
$enterStory.on("click", addWhenSubmit);

function putUserStoriesOnPage() {
  console.debug("putUserStoriesOnPage");

  $navStoryOl.empty();

  if (currentUser.ownStories.length === 0) {
    $navStoryOl.append("<h5>No stories added by user yet!</h5>");
  } else {
    // loop through all of users stories and generate HTML for them
    for (let story of currentUser.ownStories) {
      let $story = generateStoryMarkup(story, true);
      $navStoryOl.append($story);
    }
  }

  $navStoryOl.show();
}
