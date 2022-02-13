const comments = [
    {
        name: 'Miles Acosta',
        body: `I can't stop listening. Every time I hear one of their songs - the vocals - it gives me goosebumps. Shivers straight down my spine. What a beautiful expression of creativity. Can't get enough.`,
        date: '12/20/2020',
        timestamp: '1608447600000'
    },
    {
        name: 'Connor Walton',
        body: `This is art. This is inexplicable magic expressed in the purest way, everything that makes up this majestic work deserves reverence. Let us appreciate this for what it is and what it contains.`,
        date: '02/17/2021',
        timestamp: '1613545200000'
    },
    {
        name: 'Emilie Beach',
        body: `I feel blessed to have seen them in person. What a show! They were just perfection. If there was one day of my life I could relive, this would be it. What an incredible day.`,
        date: '01/09/2021',
        timestamp: '1610175600000'
    }
]
const commentContainerEl = document.getElementById('comment__container');

document.getElementById('addComment')
    .addEventListener('submit', formSubmit);

displayAllComments('desc');
// setInterval(getTimesDifferencesForDates, 30000);


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
 * Validation of form object on attempted submit. 
 * Appends error classes to inputs and resulting help blocks if form is not valid.
 * @param {Object} form the form object
 * @return {Boolean} will return true or false depending on the state of validation.
 */

function validateForm(form) {
    const nameInput = form.target.name;
    const commentInput = form.target.body;
    const nameInputHelp = document.querySelector('.form__help-name');
    const textareaHelp =  document.querySelector('.form__help-textarea');
    
    let nameIsValid = false;
    let commentIsValid = false;
    
    if (nameInput.value.length < 3) {
        nameInput.classList.add('form__input--has-error');
        nameInputHelp.innerText = 'Please enter more than 3 characters';
    } else {
        nameInput.classList.remove('form__input--has-error');
        nameIsValid = true;
        nameInputHelp.innerText = '';
    }

    if (commentInput.value.length < 10) {
        commentInput.classList.add('form__textarea--has-error');
        textareaHelp.innerText = 'Your comment has to be longer than 10 characters';
    } else {
        commentInput.classList.remove('form__textarea--has-error');
        commentIsValid = true;
        textareaHelp.innerText = '';
    }
    
    if (commentIsValid && nameIsValid) {
        return true;
    }

    return false;
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
                    message: 'Added comment to page, thanks for your input',
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
    const comment = {
        name: event.target.name.value,
        image: event.target.image.value,
        body: event.target.body.value,
        date: Date.now(),
        timestamp: new Date().getTime()
    }
    comments.push(comment);
    
    return comment;
}

/**
 * Displays all comments from the comments array. Accepts a sort order 
 * to apply sorting by date defaults to descending. Also calls the 
 * getTimesDifferencesForDates() function which call an API via axios to calculate
 * the difference between timestamps
 * @param {String} order checks for sort order. 
 */

function displayAllComments(order) {
    commentContainerEl.innerHTML = '';
    comments
        .sort((a,b) => {
            if (order == 'asc') {
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

    const columnEl = createCommentColumn();
    const column2El = createCommentColumn('wide');

    const image = createCommentImage(comment);
    const nameAndDate = createCommentNameDate(comment);
    const details = createCommentParagraph(comment);

    columnEl.appendChild(image);
    column2El.appendChild(nameAndDate);
    column2El.appendChild(details);

    articleEl.appendChild(columnEl);
    articleEl.appendChild(column2El);

    commentContainerEl.prepend(articleEl);
}

/**
 * Creates a figure container for an image for the displayed comment
 * Accepts a comment object, and returns an avatar element to be appended.
 * @param {Object} comment a comment object
 * @returns {Element}
 */

function createCommentImage(comment) {
    const avatarFigureEl = document.createElement('figure');
    avatarFigureEl.classList.add('avatar');

    if (!comment.image) {
        const avatarDivEl = document.createElement('div');
        avatarDivEl.classList.add('avatar__image');
        avatarDivEl.classList.add('avatar__image--no-image');
        avatarFigureEl.appendChild(avatarDivEl);
    } else {
        const avatarImgEl = document.createElement('img');
        avatarImgEl.classList.add('avatar__image');
        avatarImgEl.src = comment.image;
        avatarFigureEl.appendChild(avatarImgEl);
    }

    return avatarFigureEl;
}

/**
 * Creates a name and date row to be displayed in a comment
 * Accepts a comment object, and returns an div element to be appended.
 * @param {Object} comment a comment object
 * @returns {Element}
 */

function createCommentNameDate(comment) {
    const rowEl = document.createElement('div');
    rowEl.classList.add('comment__row');

    const nameEl = document.createElement('p');
    nameEl.classList.add('comment__name');
    nameEl.innerText = comment.name;

    const dateEl = document.createElement('p');
    dateEl.classList.add('comment__date');
    dateEl.setAttribute('data-timestamp', comment.timestamp);
    dateEl.innerText = comment.date;

    rowEl.appendChild(nameEl);
    rowEl.appendChild(dateEl);

    return rowEl;
}

/**
 * Creates a comment paragraph element to be displayed in a comment
 * Accepts a comment object, and returns an p element to be appended.
 * @param {Object} comment a comment object
 * @returns {Element}
 */

function createCommentParagraph(comment) {
    const detailsEl = document.createElement('p');
    detailsEl.classList.add('comment__details');
    detailsEl.innerText = comment.body;

    return detailsEl;
}

/**
 * Creates a comment__column to be displayed in a comment
 * Accepts a boolean to determine if additional class to be added, 
 * and returns an div element to be appended.
 * @param {Boolean} wide a boolean 
 * @returns {Element}
 */

function createCommentColumn(wide) {
    const columnEl = document.createElement('div');
    columnEl.classList.add('comment__column');
    
    if (wide) {
        columnEl.classList.add('comment__column--wide')
    }

    return columnEl; 
}

/**
 * Accepts a notification object. Creates an element to 
 * be appended to the body with a message. Appears for 4000ms
 * and then is removed from the DOM.
 * @param {Object} notification a notification object
 */

function displayNotification(notification) {
    let containerEl = document.createElement('div');
    containerEl.classList.add('notification');

    let headingEl = document.createElement('h4');
    headingEl.classList.add('notification__heading');
    headingEl.innerText = notification.status;

    let bodyEl = document.createElement('p');
    bodyEl.classList.add('notification__body');
    bodyEl.innerText = notification.message;

    containerEl.appendChild(headingEl);
    containerEl.appendChild(bodyEl);

    document.querySelector('body').appendChild(containerEl);
    setTimeout(() => {
        document.querySelector('.notification').remove();
    }, 4000);
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

getTimesDifferencesForDates

function getTimesFromApi(dateToSend, dateToEdit) {
    const differenceURL = 'https://myarchive.ca/api/time/difference';
    const API_KEY = 'c6823960-c4c7-49e3-b052-261c4e43ac07';

    axios
        .get(differenceURL, { params: { api_key: API_KEY, date: dateToSend } })
        .then((response) => {
            if (response.data.difference) {
                dateToEdit.innerText = response.data.difference;
            }
        })
        .catch((error) => {
            console.log(error.error);
        })
}