// Load at page load
const commentContainerEl = document.getElementById('comment__container');
const textAreaDetails = {
    field: 'form__textarea',
    helpBlock: 'form__help-textarea',
    message: 'Your comment has to be longer than 10 characters',
    characters: 10
};
const nameDetails = {
    field: 'form__input',
    helpBlock: 'form__help-name',
    message: 'Please enter more than 3 characters',
    characters: 3
};
// let faces = [];
setInterval(getTimesDifferencesForDates, 30000);
getAllCommentsFromApi();

// Event Listeners
document
    .getElementById('addComment')
    .addEventListener('submit', formSubmit);

document
    .getElementById('form__input')
    .addEventListener('focusout', () => {
        validateField(nameDetails);
    });

document
    .getElementById('form__textarea')
    .addEventListener('focusout', () => {
        validateField(textAreaDetails)
    });


/**
 * Creates a comment object constructor
 * @param {*} parent 
 * @returns 
 */

function Comment(name, comment, id, likes, timestamp) {
    this.name = name;
    this.comment = comment;
    this.id = id;
    this.likes = likes;
    this.timestamp = timestamp
}


/**
 * Attempts to submit form. Calls the validateForm() function first. If that returns true it attempts to complete a promise
 * then, will displayAllComments(), displayNotification() and reset form if successful. Otherwise it will return
 * a notification with the resulting error.
 * @param {Object} event the form event 
 */

function formSubmit(event) {
    event.preventDefault();
    if (!validateForm(event)) {
        return;
    }

    createComment(event)
        .then((result) => {
            displayNotification(result);
            this.reset();
        })
        .catch((error) => {
            displayNotification(error);
        })
}

/**
 * Form validation runs the individual functions 
 * @return {Boolean} will return true or false depending on the state of validation.
 */

function validateForm() {
    let nameIsValid = validateField(nameDetails);
    let commentIsValid = validateField(textAreaDetails);
    
    if (commentIsValid && nameIsValid) {
        return true;
    }
    
    return false;
}

/**
 * Form validation for individual fields. Takes an array consisting of a field class, help block class, the
 * total character count minimum for validation and the error message.
 * @param {Array} details an array of the fields details
 * @return {Boolean} will return true or false depending on the state of validation.
 */

function validateField(details) {
    const input = document.querySelector(`.${details.field}`);
    const inputHelp = document.querySelector(`.${details.helpBlock}`);

    if (input.value.length < details.characters) {
        input.classList.add(`${details.field}--has-error`);
        inputHelp.innerText = details.message;
        return false;
    } else {
        input.classList.remove(`${details.field}--has-error`);
        inputHelp.innerText = '';
        return true;
    }
}

/**
 * Creates a new promise which returns a message to be displayed in displayNotification()
 * Takes an event which then is posted to the DB via axios. On success the comment is formatted and 
 * appended to the display container and return a message to be displayed.
 * If it fails returns a message to be displayed.
 * @param {Event} event an array of comment objects
 * @returns {Object} returns a message to be displayed
 */

function createComment(event) {
    return new Promise((resolve, reject) => {
        const url = `${HEROKU_API_URL}comments`;
        const data = {
            name: event.target.name.value,
            comment: event.target.body.value,
        }

        axios
            .post(url, data, { 
                params: { 
                    api_key: HEROKU_API_KEY,
                } 
            })
            .then((response) => {
                console.log(response.status);
                let comment = response.data;
                comment.date = formatDateForSite();
                comment.image = event.target.image.value;
                displayComment(comment);
                return resolve({
                    status: 'Success',
                    message: 'Added comment to page, thanks for your input.',
                    timestamp: comment.date 
                })
            })
            .catch((error) => {
                return reject({
                    status: error,
                    message: `Was not able to create new comment. Please refresh page and try again`,
                    timestamp: Date.now() 
                })
            })
    })
}

/**
 * Displays all comments from the comments array by using the displayComment() function. Accepts a sort order 
 * to apply sorting by date defaults to descending. Also calls the 
 * getTimesDifferencesForDates() function which call an API via axios to calculate
 * the difference between timestamps
 * @param {Array} comments an array of comment objects
 * @param {String} order checks for sort order. 
 */

function displayAllComments(comments, order) {
    commentContainerEl.innerHTML = '';
    comments
        .sort((a,b) => {
            if (order === 'asc') {
                return new Date(b.timestamp) - new Date(a.timestamp);
            }
            return new Date(a.timestamp) - new Date(b.timestamp);
        })
        .forEach((comment, index) => {
            if (index === 0) {
                comment.last = true;
            }
            displayComment(comment);
        });
}

/**
 * Displays individual comments. Accepts a comment object and displays
 * it in the commentContainerEl. Used by a forEach method in displayAllComments()
 * @param {Object} comment a comment object
 */

function displayComment(comment) {
    const articleEl = document.createElement('article');
    articleEl.classList.add('comment');
    
    if (comment.last) {
        articleEl.classList.add('comment--last');
    }
    
    const columnEl = newElement(articleEl, 'div', 'comment__column');
    const columnWideEl = newElement(articleEl, 'div', 'comment__column comment__column--wide');
    const avatarContainer = newElement(columnEl, 'figure', 'avatar');
    
    if (!comment.image) {
        newElement(avatarContainer, 'div', 'avatar__image avatar__image--no-image', false, ['data-name'], [comment.name]);
    } else {
        newElement(avatarContainer, 'img', 'avatar__image', false, ['src', 'data-name'], [comment.image, comment.name]);
    }
    
    const nameAndDateRow = newElement(columnWideEl, 'div', 'comment__row');
    newElement(nameAndDateRow, 'p', 'comment__name', comment.name);
    const dateEl = newElement(nameAndDateRow, 'p', 'comment__date', comment.date, ['data-timestamp'], [comment.timestamp]);

    const commentAndLikeRow = newElement(columnWideEl, 'div', 'comment__row comment__row--last');
    newElement(commentAndLikeRow, 'p', 'comment__details', comment.comment);
    // const deleteLink = newElement(commentAndLikeRow, 'span', 'comment__delete-link', false, ['data-id'], [comment.id]);
    // newElement(deleteLink, 'img', 'comment__delete-btn', false, 'src', '../assets/icons/icon-delete.svg');

    const likes = formatLikeText(comment.likes);
    const likeLink = newElement(commentAndLikeRow, 'span', 'comment__like-link', likes);
    const likeBtn = newElement(
        commentAndLikeRow,
        'img',
        'comment__like-btn',
        false,
        ['src', 'data-id', 'alt', 'data-likes'],
        ['../assets/icons/icon-like.svg',comment.id, `like this post by ${comment.name}`, comment.likes]
    );

    likeBtn.addEventListener('click', addLike);

    commentContainerEl.prepend(articleEl);
    getTimesFromApi(comment.timestamp, dateEl);
}

/**
 * Add like to existing post. Takes a click of the like button and increments the like count
 * by one. It calls add like to row which formats the likes based on quantity. Once done the new
 * like count is appended to the containing rows span.
 * @param {Event} event takes the click event data
 */

function addLike(event) {
    const spanEl = event.target;
    const id = spanEl.getAttribute('data-id');
    const likes = spanEl.getAttribute('data-likes');
    const url = `${HEROKU_API_URL}comments/${id}/like?api_key=${HEROKU_API_KEY}`;

    if (id && likes) {
        return axios
        .put(url)
        .then((response) => {
            spanEl.previousSibling.innerText = formatLikeText(response.data.likes);
        })
        .catch((error) => {
            if (error.error) {
                displayNotification(error.error);
            }
        })
    } 
}

/**
 * Formats the like count to reflect whether it exists and if it is plural or singular.
 * @param {Number} likes the current like count
 * @returns {String} returns a formatted string to display in row
 */

function formatLikeText(likes) {
    let likeText = (likes > 1) ? 'likes' : 'like';
    return (likes > 0) ? `${likes} ${likeText}` : likes;
}

/**
 * Displays all images on all existing comments. Gets a random image for the avatar
 * from the faces array being populated by an API call to https://myarchive.ca/api/people/faces
 */

 function addImagesToComments(faces) {
    let avatars = document.querySelectorAll('.avatar__image');
    avatars.forEach((avatar, index) => {
        if (index !== 0) {
            let parent = avatar.parentElement;
            let name = avatar.getAttribute('data-name');
            let randomNum = Math.floor(Math.random() * 18) + 1;
            let random = faces[randomNum];
            let newAvatar = newElement(parent, 'img', 'avatar__image', false, ['src', 'alt'], [random.url, `an avatar image for ${name}`]);
            newAvatar.addEventListener('load', (event) => {
                avatar.remove();
            })
        }
    })
}

/**
 * Called by displayAllComments(). Gets all current comment__date elements and
 * creates a new array of them. Goes through a forEach to run the getTimesFromApi()
 * function on each date element.
 */

function getTimesDifferencesForDates() {
    const currentDates = document.querySelectorAll('.comment__date');
    currentDates.forEach((currentDate) => {
        const timestamp = currentDate.getAttribute('data-timestamp');
        getTimesFromApi(timestamp, currentDate);
    })
}

/**
 * An API call to calculate the time since in human readable format.
 * Called by getTimesDifferencesForDates(), on page load, and every 30 secs by setInterval();
 * The API is a basic PHP script which calculates the difference between two
 * timestamps and sends back a JSON object whether an error or success.
 * More details are available at https://myarchive.ca/api on my server.
 * The API was created by me, just to try out the axios feature we learned last week.
 * Originally provided calculation in JS, but wanted some further challenge.
 * @param {String} dateToSend a timestamp in JS milleseconds format
 * @param {Element} dateToEdit a comment__date element
 */

function getTimesFromApi(dateToSend, dateToEdit) {
    const differenceURL = `${MYARCHIVE_API_URL}time/difference`;
    const daysAgo = dateToEdit.innerText.slice(dateToEdit.innerText.length - 8);
    
    if (daysAgo !== 'days ago') {
        axios
            .get(differenceURL, { 
                params: { 
                    api_key: MYARCHIVE_API_KEY,
                    date: Number(dateToSend) - 2000 
                } 
            })
            .then((response) => {
                if (response.data.difference) {
                    dateToEdit.innerText = response.data.difference;
                }
            })
            .catch((error) => {
                if (error.error) {
                    displayNotification(error.error);
                }
            })
    }
}

/**
 * An API call to retrieve all existing comments from the server. Displays all
 * comments using the displayAllComments function once a response happens.
 */

 function getAllCommentsFromApi() {
    const url = `${HEROKU_API_URL}comments`;

    axios
        .get(url, { 
            params: { 
                api_key: HEROKU_API_KEY,
            } 
        })
        .then((response) => {
            response.data.map((comment) => {
                return comment.date = formatDateForSite(comment.timestamp);
            })
            displayAllComments(response.data, 'desc');
        })
        .then(() => {
            getFacesFromApi();
        })
        .catch((error) => {
            if (error.error) {
                displayNotification(error.error);
            }
        })
}

/**
 * Makes an API call to https://myarchive.ca/api/people/faces to retrieve and
 * array of random portraits for the comments section. Sets the faces array to the
 * response and then runs the addImagesToComments function to replace all of the 
 * image placeholders.
 */

 function getFacesFromApi() {
    const facesURL = `${MYARCHIVE_API_URL}people/faces`;
    axios
        .get(facesURL, { 
            params: { 
                api_key: MYARCHIVE_API_KEY,
            } 
        })
        .then((response) => {
            if (response.data.length > 1) {
                addImagesToComments(response.data, length);
            }
        })
        .catch((error) => {
            if (error.error) {
                displayNotification(error.error);
            }
        })
}