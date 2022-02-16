const HEROKU_API_KEY = "5f55f85c-8889-47cf-bbbe-588122e5c487";
const MYARCHIVE_API_KEY = 'c6823960-c4c7-49e3-b052-261c4e43ac07';
const HEROKU_API_URL = 'https://project-1-api.herokuapp.com/';
const MYARCHIVE_API_URL = 'https://myarchive.ca/api/';

/**
 * Accepts a notification object. Creates an element to 
 * be appended to the body with a message. Appears for 4000ms
 * and then is removed from the DOM.
 * @param {Object} notification a notification object
 */

 function displayNotification(notification) {
    let containerEl = document.createElement('div');
    containerEl.classList.add('notification');

    newElement(containerEl, 'h4', 'notification__heading', notification.status);
    newElement(containerEl, 'p', 'notification__body', notification.message);

    document.querySelector('body').appendChild(containerEl);
    setTimeout(() => {
        document.querySelector('.notification').remove();
    }, 4000);
}

/**
 * Creates elements dynamically to streamline creation
 * @param {Element} parent final element to be returned with content;
 * @param {Element} element type of element to be created
 * @param {String} classes optional if required any classes required in string form seperated by spaces
 * @param {String} text optional if required for inner text
 * @param {String} attr optional if required target an element attribute
 * @param {String} attrDetails optional if required setting an element attribute value
 * @returns {Element} formatted element appended to the parent supplied
 */

 function newElement(parent, element, classes = false, text = false, attr = false, attrDetails = false) {
    const el = document.createElement(element);
    parent.appendChild(el);
    if (classes) {
        el.className = classes;
    }
    if (text) {
        el.innerText = text;
    }
    if (attr && attrDetails) {
        el.setAttribute(attr, attrDetails);
    }
    return el;
}

/**
 * Makes an API call to https://myarchive.ca/api/people/faces to retrieve and
 * array of random portraits for the comments section. Sets the faces array to the
 * response and then runs the addImagesToComments function to replace all of the 
 * image placeholders.
 */


function getFacesFromApi() {
    const facesURL = `${MYARCHIVE_API_URL}people/faces`;
    axios
        .get(facesURL, { 
            params: { 
                api_key: MYARCHIVE_API_KEY,
            } 
        })
        .then((response) => {
            if (response.data.length > 1) {
                faces = response.data;
                addImagesToComments();
            }
        })
        .catch((error) => {
            if (error.error) {
                displayNotification(error.error);
            }
        })
}

// array data
// const comments = [
//     {
//         name: 'Miles Acosta',
//         body: `I can't stop listening. Every time I hear one of their songs - the vocals - it gives me goosebumps. Shivers straight down my spine. What a beautiful expression of creativity. Can't get enough.`,
//         date: '12/20/2020',
//         timestamp: '1608447600000'
//     },
//     {
//         name: 'Connor Walton',
//         body: `This is art. This is inexplicable magic expressed in the purest way, everything that makes up this majestic work deserves reverence. Let us appreciate this for what it is and what it contains.`,
//         date: '02/17/2021',
//         timestamp: '1613545200000'
//     },
//     {
//         name: 'Emilie Beach',
//         body: `I feel blessed to have seen them in person. What a show! They were just perfection. If there was one day of my life I could relive, this would be it. What an incredible day.`,
//         date: '01/09/2021',
//         timestamp: '1610175600000'
//     }
// ]

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
