import utils from '../utils/utils';

/**
 * Determines if the element is a valid element to stop the delegation loop and
 * fire the click event.
 * @param  {HTMLElement} element current in the deligation loop
 * @return {boolean} is element of interest?
 */
function isClickTarget(element) {
    return element.hasAttribute('ceddl-click') ||
           (element.nodeType === 1 && element.tagName.toUpperCase() === 'BUTTON') ||
           (element.nodeType === 1 && element.tagName.toUpperCase() === 'A');
}

/**
 * A deligation loop to find the clicked element and execute click callback
 * with that element.
 * @param  {Function} callback Function to execute with clicked element.
 * @param  {HTMLElement} el DOM element
 */
function delegate(callback, el) {
    var currentElement = el;

    do {
        if (!isClickTarget(currentElement)) continue;
        callback(currentElement);
        return;
    } while(currentElement.nodeName.toUpperCase() !== 'BODY' && (currentElement = currentElement.parentNode));
}

/**
 * getClickEventData is a helper function to collect data related to
 * the click event. Made it possible to look at data from a parent.
 * @param {HTMLElement} element DOM element
 */
function getClickEventData(element) {
    let textContent = element.textContent.replace(/\s\s+/g, ' ').trim();

    const baseObj = {
        'xtag': utils.perfXtagString(element),
        'action': 'click',
        'tag': element.tagName.toLowerCase(),
        'url':  window.location.href,
        'textContent': textContent.length < 75 ? textContent : undefined
    };
    if (element.id && element.id !== '') {
        baseObj.id = element.id;
    }
    if (element.href && element.href !== '') {
        baseObj.href = element.href;
    }

    Object.assign(baseObj, utils.getAllElementsAttributes(element));

    delete baseObj.ceddl;
    return baseObj;
}

/**
 * getsubmitEventData is a helper function to collect data related to
 * @param  {HTMLElement} element Form DOM element
 * @return {Object} baseObj
 */
function getsubmitEventData(element) {
    var baseObj = {
        'xtag': utils.perfXtagString(element),
        'action': 'submit',
        'tag': element.tagName.toLowerCase(),
        'url':  window.location.href,
    };
    if (element.id && element.id !== '') {
        baseObj.id = element.id;
    }
    if (element.action && element.action !== '') {
        baseObj.href = element.action;
    }

    Object.assign(baseObj, utils.getAllElementsAttributes(element));

    delete baseObj.ceddl;
    return baseObj;
}

/**
 * @desc This class is created to prevent managing a huge amount of event handlers
 * inside the tag container. The sets an eventhandler for clicks and submits in the body.
 * runs a delegation loop to find the element that was clicked. Then it will try to get
 * data from effected element.

 * We decided to not implement models, validation and sub data to keep the complexity down.
 * Form errors should probably be in a observer and not a submit event.
 */
function ClickObserver(ceddl) {
    this.ceddl = ceddl;

    // Bind scope on class methods so 'this' behaves as expected.
    this.measureClick = this.measureClick.bind(this);
    this.measureSubmit = this.measureSubmit.bind(this);

    utils.pageReady(this.setListeners.bind(this));
}

/**
 * measureClick is adding the option to add a custom name to an event
 * @param {HTMLElement} element DOM element
 */
ClickObserver.prototype.measureClick = function(element) {
    var attributes = utils.getAllElementsAttributes(element);
    var eventName = attributes.ceddl.click || 'click';
    var eventData = getClickEventData(element);

    this.ceddl.fireEvent(eventName, eventData);
};

/**
 * measureSubmit is adding the option to add a custom name to an event.
 * @param  {HTMLElement} element Form DOM element
 */
ClickObserver.prototype.measureSubmit = function(element) {
    var attributes = utils.getAllElementsAttributes(element);
    var eventName = attributes.ceddl.submit || 'submit';
    var eventData = getsubmitEventData(element);

    this.ceddl.fireEvent(eventName, eventData);
};

/**
 * Detecting clicks and submits
 */
ClickObserver.prototype.setListeners = function() {
    var that = this;
    var doc = document.body || document.documentElement;

    doc.addEventListener('click', function(e) {
        e = e || event;
        const target = e.target;
        delegate(that.measureClick, target);
    }, true);

    doc.addEventListener('submit', function(e) {
        e = e || event;
        const target = e.target;
        that.measureSubmit(target);
    }, true);
};

export default ClickObserver;
