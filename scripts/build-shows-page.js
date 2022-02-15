// Load at page load
const cardsContainer = document.getElementById('cardsContainer');
createAndDisplayShowsHeaderRow();
displayShows('asc');

// Event Listeners
const cards = document.querySelectorAll('.card');
cards.forEach((card) => {
    card.addEventListener('click', addActiveClass);
})

/**
 * Displays all shows in the shows array. Accepts a string argument which
 * sorts array order by ascending default and option of sorting descending
 * calls createShow which formats a show object. Appends all shows to the
 * cardsContainer element
 * @param {String} order 
 */

function displayShows(order) {
    shows
        .sort((a,b) => {
            if (order === 'desc') {
                return new Date(b.date) - new Date(a.date);
            }
            return new Date(a.date) - new Date(b.date);
        }).forEach((show, index, array) => {
            const createdShow = createShow(show);
            if (index === array.length - 1) {
                createdShow.classList.add('card--last');
            }

            cardsContainer.appendChild(createdShow);
        })
}

/**
 * Creates all elements of a show to be displayed on the shows page.
 * Returns a formatted show element ready for appending in the forEach loop of
 * displayShows()
 * @param {Object} show the show object
 * @return {Element} returns the show element
 */

function createShow(show) {
    let cardEl = document.createElement('section');
    cardEl.classList.add('card');

    newElement(cardEl, 'p', 'card__description', 'Date');
    newElement(cardEl, 'p', 'card__date', show.date);
    newElement(cardEl, 'p', 'card__description', 'Venue');
    newElement(cardEl, 'p', 'card__venue', show.venue);
    newElement(cardEl, 'p', 'card__description', 'Location');
    newElement(cardEl, 'p', 'card__location', show.location);
    newElement(cardEl, 'button', 'card__button', 'Buy Tickets');

    return cardEl;
}

/**
 * Creates a header row item for display above the shows on the show page
 * this element is not visible on mobile sizes. The header row is appended by this 
 * function on page load.
 */

function createAndDisplayShowsHeaderRow() {
    let headerEl = document.createElement('section');
    headerEl.classList.add('card__header-row');

    newElement(headerEl, 'p', 'card__header', 'Date')
    newElement(headerEl, 'p', 'card__header', 'Venue')
    newElement(headerEl, 'p', 'card__header', 'Location')
    newElement(headerEl, 'button', 'card__button card__button--hidden', 'Buy Tickets')

    cardsContainer.appendChild(headerEl);
}

/**
 * This function is called by clicking on a show row, which is watched by addEventListener.
 * It checks to see if the element being clicked is a child of the row, or is the row itself,
 * either way the active class is applied to the show card element. All other instances of card--active
 * are removed before applying to the current element.
 */

function addActiveClass(event) {
    const target = event.target.classList;
    const parent = event.target.parentElement.classList;
    if (target.contains('card')) {
        clearActiveClass()
        target.add('card--active')
    } else if (parent.contains('card')) {
        clearActiveClass()
        parent.add('card--active');
    }
}

/**
 * called by addActiveClass(). Loops through all show cards and removes the card--active class
 */

function clearActiveClass() {
    cards.forEach((card) => {
        card.classList.remove('card--active');
    })
}