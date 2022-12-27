// create and export a card div

export function createCardDiv(event) {
  // create a div for the event data
  const eventDiv = document.createElement('div');
  eventDiv.classList.add('event-div');

  // get the author's public key and shorten it
  function getShortAuthor(author) {
    return author.substring(0, 8);
  }

  const shortAuthor = getShortAuthor(event.pubkey);
  const content = event.content;
  const timeElapsed = event.created_at;

  // check if the content has any image links
  const imageLinks = content.match(/(https?:\/\/.*\.(?:png|jpg|jpeg))/gi);

  // if there are image links, create an image element and append it to the div and then append the event.content to the div

  if (imageLinks) {
    const image = document.createElement('img');
    image.src = imageLinks[0];
    image.classList.add('w-full', 'rounded-xl', 'mb-4');
    eventDiv.appendChild(image);
  } else {
    // if there are no image links, create a div with the content and append it to the div
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('content-div');
    contentDiv.innerHTML = content;
    eventDiv.appendChild(contentDiv);
  }

  // update the div with the event data
  eventDiv.innerHTML = `
      <div class='flex items-center'>  
          <div class='flex flex-col'>
          <div class='flex items-center'>
              <div class='author-div'>
              <p class='text-sm font-bold'>${shortAuthor}</p>
              </div>
              <div class='time-div'>
              <p class='text-xs text-gray-500'>${timeElapsed}</p>
              </div>
          </div>
          <div class='content-div'>
              <p class='text-sm text-gray-700'>${content}</p>
          </div>
          </div>
      </div>
      `;
}
