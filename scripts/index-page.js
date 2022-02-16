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
let faces = [];
displayAllComments('desc');
setInterval(getTimesDifferencesForDates, 30000);
getFacesFromApi();

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

    createCommentPromise(event)
        .then((result) => {
            displayAllComments('desc');
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
 * Form validation for individual fields
 * @param {String} field string representation of input class without .
 * @param {String} fieldHelp string representation of help block class without .
 * @param {String} message string representation validation error message
 * @param {Number} characters number of characters to be validated in value
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
 * A promise to check whether or not the comment was successfully created.
 * Not entirely required, just wanted to include some promise functionality to JS
 * Returns a promise with a resolve/reject for displayNotification() in formSubmit()
 * @param {Object} event the form details
 * @return {Promise}
 */

function createCommentPromise(event) {
    return new Promise((resolve, reject) => {
        let comment = createComment(event);
        if (comment) {
            return resolve({
                    status: 'Success',
                    message: 'Added comment to page, thanks for your input.',
                    timestamp: comment.date 
                })
        }
        return reject({
                status: 'Error',
                message: 'Was not able to create new comment. Please refresh page and try again',
                timestamp: Date.now() 
            })
    })
}

/**
 * Creates a comment object from the form submission. Adds comment to the comments array;
 * @param {Event} event the form event 
 * @return {Object} returns a comment
 */

function createComment(event) {
    let image = event.target.image.value;
    if (faces.length > 1) {
        image = faces[Math.floor(Math.random() * 6) + 1].url;
    }
    const comment = {
        name: event.target.name.value,
        image: image,
        body: event.target.body.value,
        date: Date.now(),
        timestamp: new Date().getTime()
    }
    comments.push(comment);
    
    return comment;
}

/**
 * Displays all images on all existing comments. Gets a random image for the avatar
 * from the faces array being populated by an API call to https://myarchive.ca/api/people/faces
 */

function addImagesToComments() {
    let avatars = document.querySelectorAll('.avatar__image');
    avatars.forEach((avatar, index) => {
        if (index !== 0) {
            let parent = avatar.parentElement;
            avatar.remove();
            newElement(parent, 'img', 'avatar__image', false, 'src', faces[Math.floor(Math.random() * 6) + 1].url);
        }
    })
}

/**
 * Displays all comments from the comments array by using the displayComment() function. Accepts a sort order 
 * to apply sorting by date defaults to descending. Also calls the 
 * getTimesDifferencesForDates() function which call an API via axios to calculate
 * the difference between timestamps
 * @param {String} order checks for sort order. 
 */

function displayAllComments(order) {
    commentContainerEl.innerHTML = '';
    comments
        .sort((a,b) => {
            if (order === 'asc') {
                return new Date(b.date) - new Date(a.date);
            }
            return new Date(a.date) - new Date(b.date);
        })
        .forEach((comment, index) => {
            if (index === 0) {
                comment.last = true;
            }
            comment.date = new Date(comment.date).toLocaleDateString('en-US', {year: 'numeric', month: '2-digit', day: '2-digit'})
            displayComment(comment);
        });
        getTimesDifferencesForDates();
}

/**
 * Displays individual comments. Accepts a comment object and displays
 * it in the commentContainerEl. Used by a forEach method in displayAllComment()
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
        newElement(avatarContainer, 'div', 'avatar__image avatar__image--no-image');
    } else {
        newElement(avatarContainer, 'img', 'avatar__image', false, 'src', comment.image);
    }
    
    const nameAndDateRow = newElement(columnWideEl, 'div', 'comment__row');
    newElement(nameAndDateRow, 'p', 'comment__name', comment.name);
    newElement(nameAndDateRow, 'p', 'comment__date', comment.date, 'data-timestamp', comment.timestamp);
    newElement(columnWideEl, 'p', 'comment__details', comment.body);

    commentContainerEl.prepend(articleEl);
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
    const differenceURL = 'https://myarchive.ca/api/time/difference';
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