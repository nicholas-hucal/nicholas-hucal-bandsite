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

function formatDateForSite(timestamp) {
    if (timestamp) {
        return new Date(Number(timestamp)).toLocaleDateString('en-US', {year: 'numeric', month: '2-digit', day: '2-digit'});
    }
    return new Date().toLocaleDateString('en-US', {year: 'numeric', month: '2-digit', day: '2-digit'});
}
