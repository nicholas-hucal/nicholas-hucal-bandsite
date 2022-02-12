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
displayAllComments();

function formSubmit(event) {
    event.preventDefault();
    createComment(event);
    displayAllComments();
    this.reset();
}

function displayAllComments() {
    commentContainerEl.innerHTML = '';
    comments
        .sort((a,b) => {
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

function createComment(event) {
    const comment = {
        name: event.target.name.value,
        image: event.target.image.value,
        body: event.target.body.value,
        date: Date.now()
    }
    comments.push(comment);
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