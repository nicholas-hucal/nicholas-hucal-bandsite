const comments = [
    {
        name: 'Miles Acosta',
        body: `I can't stop listening. Every time I hear one of their songs - the vocals - it gives me goosebumps. Shivers straight down my spine. What a beautiful expression of creativity. Can't get enough.`,
        date: '12/20/2020'
    },
    {
        name: 'Connor Walton',
        body: `This is art. This is inexplicable magic expressed in the purest way, everything that makes up this majestic work deserves reverence. Let us appreciate this for what it is and what it contains.`,
        date: '02/17/2021'
    },
    {
        name: 'Emilie Beach',
        body: `I feel blessed to have seen them in person. What a show! They were just perfection. If there was one day of my life I could relive, this would be it. What an incredible day.`,
        date: '01/09/2021'
    }
]

document.getElementById('addComment')
    .addEventListener('submit', formSubmit);

const commentContainerEl = document.getElementById('comment__container');
displayAllComments('desc');

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
    if (commentInput.value < 10) {
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

function createComment(event) {
    const comment = {
        name: event.target.name.value,
        image: event.target.image.value,
        body: event.target.body.value,
        date: Date.now()
    }
    comments.push(comment);
    return comment;
}

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
}

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

function createCommentNameDate(comment) {
    const rowEl = document.createElement('div');
    rowEl.classList.add('comment__row');

    const nameEl = document.createElement('p');
    nameEl.classList.add('comment__name');
    nameEl.innerText = comment.name;

    const dateEl = document.createElement('p');
    dateEl.classList.add('comment__date');
    dateEl.innerText = comment.date;

    rowEl.appendChild(nameEl);
    rowEl.appendChild(dateEl);

    return rowEl;
}

function createCommentParagraph(comment) {
    const detailsEl = document.createElement('p');
    detailsEl.classList.add('comment__details');
    detailsEl.innerText = comment.body;

    return detailsEl;
}

function createCommentColumn(wide) {
    const columnEl = document.createElement('div');
    columnEl.classList.add('comment__column');
    if (wide) {
        columnEl.classList.add('comment__column--wide')
    }
    return columnEl; 
}

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
    }, 3000);
}