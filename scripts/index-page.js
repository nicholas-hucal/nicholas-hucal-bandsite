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
getAllCommentsFromApi();
let faces = createFaces();

// Event Listeners
document
    .getElementById('addComment')
    .addEventListener('submit', formSubmit);

document
    .getElementById('form__input')
    .addEventListener('keyup', () => {
        validateField(nameDetails);
    });

document
    .getElementById('form__textarea')
    .addEventListener('keyup', () => {
        validateField(textAreaDetails)
    });

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
    }
    input.classList.remove(`${details.field}--has-error`);
    inputHelp.innerText = '';
    return true;
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
 * it in the commentContainerEl. Used by a forEach method in displayAllComments() and in createComment()
 * @param {Object} comment a comment object
 */

function displayComment(comment) {
    const articleEl = document.createElement('article');
    articleEl.classList.add('comment');
    articleEl.setAttribute('id', comment.id);
    
    if (comment.last) {
        articleEl.classList.add('comment--last');
    }
    
    const columnEl = newElement(articleEl, 'div', 'comment__column');
    const columnWideEl = newElement(articleEl, 'div', 'comment__column comment__column--wide');
    const avatarContainerEl = newElement(columnEl, 'figure', 'avatar');
    
    const avatarImageEl = newElement(
        avatarContainerEl,
        'img',
        'avatar__image',
        false,
        ['src', 'alt'],
        [comment.image ? comment.image : getRandomAvatar(), `Avatar image for ${comment.name}`]
    );
    
    const nameAndDateRowEl = newElement(columnWideEl, 'div', 'comment__row');
    const nameEl = newElement(nameAndDateRowEl, 'p', 'comment__name', comment.name);
    const dateEl = newElement(nameAndDateRowEl, 'p', 'comment__date', createHumanReadableDate(comment.timestamp), ['data-timestamp'], [comment.timestamp]);

    const commentRowEl = newElement(columnWideEl, 'div', 'comment__row');
    const commentEl = newElement(commentRowEl, 'p', 'comment__details', comment.comment);

    const likesRowEl = newElement(columnWideEl, 'div', 'comment__row comment__row--last')
    const likesContainerEl = newElement(likesRowEl, 'div', 'comment__likes-container')
    
    const likesText = formatLikeText(comment.likes);
    const likesSpanEl = newElement(likesContainerEl, 'span', 'comment__like-link', likesText);
    const likeBtnEl = newElement(
        likesContainerEl,
        'img',
        'comment__like-btn',
        false,
        ['src', 'data-id', 'alt', 'data-likes'],
        ['../assets/icons/icon-like.svg', comment.id, `like this post by ${comment.name}`, comment.likes]
    );

    const deleteBtnEl = newElement(
        articleEl,
        'img',
        'comment__delete-btn',
        false,
        ['src', 'data-comment-id'],
        ['../assets/icons/icon-x.svg', comment.id]
    );
    deleteBtnEl.setAttribute('data-interval-id', updateHumanReadableDates(dateEl));
    deleteBtnEl.addEventListener('click', (event) => {
        displayModal(event.target, articleEl.cloneNode(true));
    });
    
    likeBtnEl.addEventListener('click', addLike);

    commentContainerEl.prepend(articleEl);
}

/**
 * Formats the like count to reflect whether it exists and if it is plural or singular.
 * @param {Number} likes the current like count
 * @returns {String} returns a formatted string to display in row
 */

 function formatLikeText(likes) {
    let likeText = (likes > 1) ? 'likes' : 'like';
    return (likes > 0) ? `${likes} ${likeText}` : 'be first';
}

/**
 * Gets a random image to use when constructing the comment element. It 
 * is called by displayComment()
 * @returns {String} returns a string for an image on the server
 */

function getRandomAvatar() {
    let randomNum = Math.floor(Math.random() * 18) + 1;
    return faces[randomNum];
}

/**
 * Creates an array of existing faces images to use for the comment avatars
 * This function is called at page load
 * @returns {Array} an array of string urls of face images
 */

function createFaces() {
    let allFaces = []
    for (let i = 1; i < 20; i++) {
        let count = String(i).padStart(3, 0);
        allFaces.push(`../assets/images/faces_${count}.jpeg`);
    }
    return allFaces;
}

/**
 * Function to update the human readable dates every 15 secs.
 * Called after inital display of displayAllComments is complete;
 * Returns and interval id to be appended to a comment row to cancel interval
 * as required. Set as a 'data-interval-id' attribute.
 * @returns {Number} returns interval id 
 */

function updateHumanReadableDates(date) {
    return setInterval(() => {
        const timestamp = date.getAttribute('data-timestamp');
        date.innerText = createHumanReadableDate(timestamp);
    }, 15000);
}

/**
 * Function to get human readable dates with array methods. Accepts a timestamp
 * and returns a string of human readable dates in format of (quantity type) ago
 * @param {String or Number}
 * @returns {String}
 */

function createHumanReadableDate(timestamp) {
    let currentTimestamp = new Date().getTime();
    let timeDifference = currentTimestamp - timestamp;
    let types = ['seconds', 'mins', 'hours', 'days', 'months', 'years'];
    let seconds = [1000, 60000, 3600000, 86400000, 2592000000, 31536000000, 63072000000000];
    let times = types.map((type, index) => {
        let time = {
            type: type,
            seconds: seconds[index],
            next: seconds[index + 1],
            plural: `${type} ago`,
            singular: `${type.slice(0, -1)} ago` 
        }
        return time;
    })
    let howLongAgo = times.find((time) => time.seconds < timeDifference && time.next > timeDifference);
    if (howLongAgo) {
        if (howLongAgo.seconds * 2 > timeDifference) {
            return `${Math.floor(timeDifference/howLongAgo.seconds)} ${howLongAgo.singular}`;
        } else {
            return `${Math.floor(timeDifference/howLongAgo.seconds)} ${howLongAgo.plural}`;
        }
    }
    return 'now';
}

/**
 * Add like to existing post. Takes a click of the like button and increments the like count
 * by one. It calls formatLikeText which formats the likes based on quantity. Once done the new
 * like count is appended to the containing rows span. A simple scale animation is added via
 * the class comment__like-btn--clicked and then removed. If a like cannot be added a notification
 * is displayed with the error.
 * @param {Event} event takes the click event data
 */

function addLike(event) {
    const imgEl = event.target;
    const id = imgEl.getAttribute('data-id');
    const likes = imgEl.getAttribute('data-likes');
    const url = `${HEROKU_API_URL}comments/${id}/like?api_key=${HEROKU_API_KEY}`;

    if (id && likes) {
        return axios
            .put(url)
            .then((response) => {
                imgEl.previousSibling.innerText = formatLikeText(response.data.likes);
                imgEl.classList.add('comment__like-btn--clicked');
                setTimeout(() => {
                    imgEl.classList.remove('comment__like-btn--clicked');
                }, 250);
            })
            .catch((error) => {
                if (error) {
                    displayNotification(error);
                }
            })
    } 
}

/**
 * Delete comment from api. This is called from a modal when a delete button is clicked on a comment.
 * If it is successful it removes the attached interval for refreshing human readable time and
 * then removes the corresponding rows from the DOM, then returns true, to remove the modal
 * from the DOM; A notification is shown in either case whether successful or not. 
 * @returns {Boolean}
 */

function deleteComment(commentInfo) {
    let intervalId = commentInfo.getAttribute('data-interval-id');
    let commentId = commentInfo.getAttribute('data-comment-id');
    const url = `${HEROKU_API_URL}comments/${commentId}`;

    if (intervalId && commentId) {
        return axios
            .delete(url, { 
                params: { 
                    api_key: HEROKU_API_KEY,
                } 
            })
            .then((response) => {
                let commentEl = document.getElementById(response.data.id);
                commentEl.classList.add('comment--deleted');
                setTimeout(() => {
                    commentEl.remove();
                }, 1000);
                clearInterval(intervalId);
                displayNotification({
                    status: 'Success',
                    message: 'Deleted Comment'
                });
                return true
            })
            .catch((error) => {
                if (error) {
                    displayNotification(error);
                }
                return true;
            })
    } 
}

/**
 * An API call to retrieve all existing comments from the server. Displays all
 * comments using the displayAllComments function once a response happens.
 * Otherwise displays an error notification on failure.
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
            let comments = response.data.map((comment) => {
                comment.date = formatDateForSite(comment.timestamp);
                return comment;
            })
            displayAllComments(comments, 'desc');
        })
        .catch((error) => {
            displayNotification(error);
        })
}