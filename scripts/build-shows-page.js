const shows = [
    {
        date: 'Mon Sept 06 2021 ',
        venue: 'Ronald Lane ',
        location: 'San Francisco, CA',
    },
    {
        date: 'Tue Sept 21 2021',
        venue: 'Pier 3 East',
        location: 'San Francisco, CA',
    },
    {
        date: 'Fri Oct 15 2021 ',
        venue: 'View Lounge',
        location: 'San Francisco, CA ',
    },
    {
        date: 'Sat Nov 06 2021',
        venue: 'Hyatt Agency',
        location: 'San Francisco, CA',
    },
    {
        date: 'Fri Nov 26 2021',
        venue: 'Moscow Center',
        location: 'San Francisco, CA',
    },
    {
        date: 'Wed Dec 15 2021',
        venue: 'Press Club',
        location: 'San Francisco, CA',
    },
]

const cardsContainer = document.getElementById('cardsContainer');
createAndDisplayShowsHeaderRow();
displayShows('asc');

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
            if (order == 'desc') {
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

    let dateTitleEl = document.createElement('p');
    dateTitleEl.classList.add('card__description');
    dateTitleEl.innerText = 'Date';

    let dateEl = document.createElement('p');
    dateEl.classList.add('card__date');
    dateEl.innerText = show.date;

    let venueTitleEl = document.createElement('p');
    venueTitleEl.classList.add('card__description');
    venueTitleEl.innerText = 'Venue';

    let venueEl = document.createElement('p');
    venueEl.classList.add('card__venue');
    venueEl.innerText = show.venue;

    let locationTitleEl = document.createElement('p');
    locationTitleEl.classList.add('card__description');
    locationTitleEl.innerText = 'Location';

    let locationEl = document.createElement('p');
    locationEl.classList.add('card__location');
    locationEl.innerText = show.location;

    let buttonEl = document.createElement('button');
    buttonEl.classList.add('card__button');
    buttonEl.innerText = 'Buy Tickets';

    cardEl.append(dateTitleEl, dateEl, venueTitleEl, venueEl, locationTitleEl, locationEl, buttonEl);

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
    
    let dateEl = document.createElement('p');
    dateEl.classList.add('card__header');
    dateEl.innerText = 'Date';

    let venueEl = document.createElement('p');
    venueEl.classList.add('card__header');
    venueEl.innerText = 'Venue'

    let locationEl = document.createElement('p');
    locationEl.classList.add('card__header');
    locationEl.innerText = 'Location';

    let buttonEl = document.createElement('button');
    buttonEl.classList.add('card__button');
    buttonEl.classList.add('card__button--hidden');
    buttonEl.innerText = 'Buy Tickets';

    headerEl.append(dateEl, venueEl, locationEl, buttonEl);
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