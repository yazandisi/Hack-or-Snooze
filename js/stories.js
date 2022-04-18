"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

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
  // console.debug("generateStoryMarkup", story);

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
  for (let id of currentUser.favorites) {
    const gettingBoxVal = $(`#${id.storyId}`);
    const seperateList = gettingBoxVal.clone();
    $(".forFavorites").append(seperateList);
    console.log(gettingBoxVal);
  }
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
  $formAuthor.val("");
  $formTitle.val("");
  $formUrl.val("");
}
$enterStory.on("click", addWhenSubmit);
