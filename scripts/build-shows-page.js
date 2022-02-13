const concerts = [
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

function displayConcerts(order) {
    concerts
        .sort((a,b) => {
            if (order == 'desc') {
                return new Date(b.date) - new Date(a.date);
            }
            return new Date(a.date) - new Date(b.date);
        }).forEach((concert, index, array) => {
            const createdConcert = createConcert(concert);
            if (index === array.length - 1) {
                createdConcert.classList.add('card--last');
            }
            cardsContainer.appendChild(createdConcert);
        })
}

function createConcert(concert) {
    let cardEl = document.createElement('section');
    cardEl.classList.add('card');

    let dateTitleEl = document.createElement('p');
    dateTitleEl.classList.add('card__description');
    dateTitleEl.innerText = 'Date';

    let dateEl = document.createElement('p');
    dateEl.classList.add('card__date');
    dateEl.innerText = concert.date;

    let venueTitleEl = document.createElement('p');
    venueTitleEl.classList.add('card__description');
    venueTitleEl.innerText = 'Venue';

    let venueEl = document.createElement('p');
    venueEl.classList.add('card__venue');
    venueEl.innerText = concert.venue;

    let locationTitleEl = document.createElement('p');
    locationTitleEl.classList.add('card__description');
    locationTitleEl.innerText = 'Location';

    let locationEl = document.createElement('p');
    locationEl.classList.add('card__location');
    locationEl.innerText = concert.location;

    let buttonEl = document.createElement('button');
    buttonEl.classList.add('card__button');
    buttonEl.innerText = 'Buy Tickets';

    cardEl.append(dateTitleEl, dateEl, venueTitleEl, venueEl, locationTitleEl, locationEl, buttonEl);

    return cardEl;
}

displayConcerts('asc');

const cards = document.querySelectorAll('.card');
cards.forEach((card) => {
    card.addEventListener('click', addActiveClass);
})

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
    return;
}

function clearActiveClass() {
    cards.forEach((card) => {
        card.classList.remove('card--active');
    })
}