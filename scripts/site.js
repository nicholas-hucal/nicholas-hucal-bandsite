const HEROKU_API_KEY = "5f55f85c-8889-47cf-bbbe-588122e5c487";
const HEROKU_API_URL = 'https://project-1-api.herokuapp.com/';

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
        containerEl.remove();
    }, 4000);
}

/**
 * Creates elements dynamically to streamline creation
 * @param {Element} parent final element to be returned with content;
 * @param {Element} element type of element to be created
 * @param {String} classes optional if required any classes required in string form seperated by spaces
 * @param {String} text optional if required for inner text
 * @param {Array} attr optional if required target an element attribute in array format
 * @param {Array} attrDetails optional if required setting an element attribute value in array format
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
    if (attr.length >= 1 && attrDetails.length >= 1) {
        for (let i = 0; i < attr.length; i++) {
            el.setAttribute(attr[i], attrDetails[i]);
        }
    }
    return el;
}

/**
 * Accepts an optional timestamp parameter that allows for the returned formatted time to be 
 * based on that timestamp. If no timestamp is provided then a formatted date based on current
 * local time is produced in mm/dd/yyyy format.
 * @param {Number or String} timestamp in millesceconds since epoch optional
 * @returns {String} returns a formatted date string
 */

function formatDateForSite(timestamp) {
    if (timestamp) {
        return new Date(Number(timestamp)).toLocaleDateString('en-US', {year: 'numeric', month: '2-digit', day: '2-digit'});
    }
    return new Date().toLocaleDateString('en-US', {year: 'numeric', month: '2-digit', day: '2-digit'});
}