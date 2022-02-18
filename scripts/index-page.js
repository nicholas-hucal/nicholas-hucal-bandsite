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
let faces = [];

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
    createFaces();
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
    
    newElement(
        avatarContainer,
        'img',
        'avatar__image',
        false,
        ['src', 'alt'],
        [comment.image ? comment.image : getRandomAvatar(), `Avatar image for ${comment.name}`]
    );
    
    const nameAndDateRow = newElement(columnWideEl, 'div', 'comment__row');
    newElement(nameAndDateRow, 'p', 'comment__name', comment.name);
    const dateEl = newElement(nameAndDateRow, 'p', 'comment__date', createHumanReadableDate(comment.timestamp), ['data-timestamp'], [comment.timestamp]);

    const commentAndLikeRow = newElement(columnWideEl, 'div', 'comment__row comment__row--last');
    newElement(commentAndLikeRow, 'p', 'comment__details', comment.comment);
    // const deleteLink = newElement(commentAndLikeRow, 'span', 'comment__delete-link', false, ['data-id'], [comment.id]);
    // newElement(deleteLink, 'img', 'comment__delete-btn', false, ['src'], ['../assets/icons/icon-delete.svg']);

    const likes = formatLikeText(comment.likes);
    newElement(commentAndLikeRow, 'span', 'comment__like-link', likes);
    const likeBtn = newElement(
        commentAndLikeRow,
        'img',
        'comment__like-btn',
        false,
        ['src', 'data-id', 'alt', 'data-likes'],
        ['../assets/icons/icon-like.svg', comment.id, `like this post by ${comment.name}`, comment.likes]
    );

    likeBtn.addEventListener('click', addLike);

    commentContainerEl.prepend(articleEl);
    //updateHumanReadableDates(dateEl);
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
 * Gets a random image to use when constructing the comment element. It 
 * is called by displayComment
 * @returns {String} returns a string for an image on the server
 */

function getRandomAvatar() {
    let randomNum = Math.floor(Math.random() * 18) + 1;
    return faces[randomNum];
}

/**
 * Creates an array of existing faces images to use for the comment avatars
 * The faces array exists at the top of this file in the on page load.
 * This function is called from displayAllComments();
 */

function createFaces() {
    for (let i = 1; i < 20; i++) {
        let count = String(i).padStart(3, 0);
        faces.push(`../assets/images/faces_${count}.jpeg`);
    }
}

/**
 * Creates a human readable time representation for a comment. Takes a timestamp and
 * converts it to a string i.e 3 days ago, 20 secs ago
 * @param {String or Number} timestamp 
 * @returns {String}
 */

function createHumanReadableDate(timestamp) {
    let readable = '';
    let currentTimestamp = new Date().getTime();
    let timeDifference = currentTimestamp - (timestamp - 1000);
    let sec = 1000;
    let min = 60 * sec;
    let hour = 60 * min;
    let day = 24 * hour;
    let month = 30 * day;
    let year = 365 * day;
    switch (true) {
        case timeDifference > min && timeDifference < hour:
            readable = `${(timeDifference/min).toFixed()} mins ago`;      
            break;
        case timeDifference > hour && timeDifference < day:
            readable = `${(timeDifference/hour).toFixed()} hours ago`;      
            break;
        case timeDifference > day && timeDifference < month:
            readable = `${(timeDifference/day).toFixed()} days ago`;      
            break;
        case timeDifference > month && timeDifference < year:
            readable = `${(timeDifference/month).toFixed()} months ago`;      
            break;
        case timeDifference > year:
            readable = `${(timeDifference/year).toFixed()} years ago`;      
            break;
        default:
            readable = `${(timeDifference/1000).toFixed()} secs ago`;
            break;     
    }
    return readable;
}

/**
 * Function to update the human readable dates every 15 secs.
 * Called after inital display of displayAllComments is complete;
 */

function updateHumanReadableDates(date) {
    setInterval(() => {
        const timestamp = date.getAttribute('data-timestamp');
        date.innerText = createHumanReadableDate(timestamp);
    }, 15000);
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
        .catch((error) => {
            if (error.error) {
                displayNotification(error.error);
            }
        })
}