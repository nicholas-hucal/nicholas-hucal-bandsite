const comments = [
    {
        name: 'Connor Walton',
        image: false,
        body: `This is art. This is inexplicable magic expressed in the purest way, everything that makes up this majestic work deserves reverence. Let us appreciate this for what it is and what it contains.`,
        date: '02/17/2021'
    },
    {
        name: 'Emilie Beach',
        image: false,
        body: `I feel blessed to have seen them in person. What a show! They were just perfection. If there was one day of my life I could relive, this would be it. What an incredible day.`,
        date: '01/09/2021'
    },
    {
        name: 'Miles Acosta',
        image: false,
        body: `I can't stop listening. Every time I hear one of their songs - the vocals - it gives me goosebumps. Shivers straight down my spine. What a beautiful expression of creativity. Can't get enough.`,
        date: '12/20/2020'
    }
]

let createComment = (comment, last) => {
    const articleEl = document.createElement('article');
    articleEl.classList.add('comment');
    if (last === 1) {
        articleEl.classList.add('comment--last');
    }

    const columnDivEl = document.createElement('div');
    columnDivEl.classList.add('comment__column');

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

    columnDivEl.appendChild(avatarFigureEl);

    const column2DivEl = document.createElement('div');
    column2DivEl.classList.add('comment__column');
    
    const rowDivEl = document.createElement('div');
    rowDivEl.classList.add('comment__row');

    const nameParagraphEl = document.createElement('p');
    nameParagraphEl.classList.add('comment__name');
    nameParagraphEl.innerText = comment.name;

    const dateParagraphEl = document.createElement('p');
    dateParagraphEl.classList.add('comment__date');
    dateParagraphEl.innerText = comment.date;

    const detailsParagraphEl = document.createElement('p');
    detailsParagraphEl.classList.add('comment__details');
    detailsParagraphEl.innerText = comment.body;

    rowDivEl.appendChild(nameParagraphEl);
    rowDivEl.appendChild(dateParagraphEl);

    column2DivEl.appendChild(rowDivEl);
    column2DivEl.appendChild(detailsParagraphEl);

    articleEl.appendChild(columnDivEl);
    articleEl.appendChild(column2DivEl);
    console.log(articleEl);
    return articleEl;
}

comments.forEach((comment, index, array) => {
    let containerEl = document.getElementById('comment__container');
    let last = 0;
    if (index === array.length - 1) {
        last = 1;
    }
    let formattedComment =  createComment(comment, last);
    containerEl.appendChild(formattedComment);
});