(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (factory());
}(this, (function () { 'use strict';

    /**
     * Singleton Class for instantiating utillity's. Functions need to be
     * functional / performant and stateless to promote re-use
     *
     * @export
     * @class Utils
     */
    function Utils () {}

    /**
     * [isDate description]
     * @param  {[type]}  d [description]
     * @return {Boolean}   [description]
     */
    Utils.prototype.isDate = function(d) {
        return d instanceof Date;
    };

    /**
     * [isEmpty description]
     * @param  {[type]}  o [description]
     * @return {Boolean}   [description]
     */
    Utils.prototype.isEmpty = function(o) {
        return Object.keys(o).length === 0;
    };

    /**
     * [isObject description]
     * @param  {[type]}  o [description]
     * @return {Boolean}   [description]
     */
    Utils.prototype.isObject = function(o) {
        return o != null && o instanceof Object;
    };

    /**
     * [properObject description]
     * @param  {[type]} o [description]
     * @return {[type]}   [description]
     */
    Utils.prototype.properObject = function(o) {
        if (this.isObject(o) && !o.hasOwnProperty) {
            return Object.assign({}, o);
        } else {
            return o
        }
    };

    Utils.prototype.toCamelCase = function(attrString) {
        return attrString.replace(/-([a-z])/g, function (g) {
            return g[1].toUpperCase();
        })
    };

    /**
     * isArrayOfStrings
     * @param  {object} o
     * @return {boolean}
     */
    Utils.prototype.isArrayOfStrings = function(o) {
        if (toString.call(o) != '[object Array]') {
            return false;
        }
        for(var i=0;i<o.length;i++){
           if(typeof o[i] !== 'string')
              return false;
        }
        return true;
    };

    /**
     * A very naive deep clone that's specifically used to clone ceddl
     * model objects, as these will never contain complex data like functions
     * or date objects.
     * @param {(Object|Array)} target Data to be cloned.
     * @returns {(Object|Array)}
     * @memberof ceddlUtils
     */
    Utils.prototype.simpleDeepClone = function(target) {
        var that = this;
        var isArray = Array.isArray(target);
        var isObject = !isArray && this.isObject(target);

        if (isArray) {
            return target.map(this.simpleDeepClone.bind(this));
        } else if (isObject) {
            return Object.keys(target).reduce(function(acc, key) {
                acc[key] = that.simpleDeepClone(target[key]);
                return acc;
            }, {});
        } else {
            // The value must be a primitive.
            return target;
        }
    };

    /**
     * The purpose of this function is to deep diff two objects.
     * It will compare two objects and then output an object with
     * all the changes between them including removed and added pointers.
     * Performance was a important consideration for chosing this function.
     *
     * Unfortunately on writing this documentation I can not find the post
     * this code originated from. It has been changed slightly sinds then.
     *
     * @param {Object} lhs Left hand side object.
     * @param {Object} rhs Right hand side object.
     * @returns {Object} Returns a object containing pointers and values
     * that have changed between lhs and rhs.
     */
    Utils.prototype.diff = function(lhs, rhs) {
        var that = this;
        if (lhs === rhs) {
           return {}; // equal return no diff
        }

        if (!this.isObject(lhs) || !this.isObject(rhs)) {
            return rhs; // return updated rhs
        }

        var l = this.properObject(lhs);
        var r = this.properObject(rhs);

        var deletedValues = Object.keys(l).reduce(function(acc, key) {
            return r.hasOwnProperty(key) ? acc : Object.assign(acc, {[key]: undefined});
        }, {});

        if (this.isDate(l) || this.isDate(r)) {
            if (l.valueOf() == r.valueOf()) {
                return {};
            }
            return r;
        }

        return Object.keys(r).reduce(function(acc, key) {
            if (!l.hasOwnProperty(key)) {
                return Object.assign(acc, {[key]: r[key]}); // return added r key
            }

            var difference = that.diff(l[key], r[key]);

            if (that.isObject(difference) && that.isEmpty(difference) && !that.isDate(difference)) {
                return acc; // return no diff
            }

            return Object.assign(acc, {[key]: difference}); // return updated key
        }, deletedValues);
    };

    /**
     * Document ready function. Will resolve immidiatly if DOM has already loaded
     *
     * @param {Function} callback function
     */
    Utils.prototype.pageReady = function(callback) {
        let isReady;
        if (document.attachEvent) {
            isReady = document.readyState === "complete";
        } else {
            isReady = document.readyState !== "loading";
        }

        if (isReady) {
            callback();
        } else {
            document.addEventListener('DOMContentLoaded', callback);
        }
    };

    /**
     * low resource way of obtaining all related attributes.
     *
     * @param {Object} element from the DOM
     * @returns {Object} atribute data without prefixes
     */
    Utils.prototype.getAllElementsAttributes = function(element, opt) {
        var obj = this.simpleDeepClone(element.dataset);
        if(!opt || opt.excludeCEDDLAttributes !== true) {
           obj.ceddl = {};
        }

        if(element) {
            for (var i = 0; i < element.attributes.length; i++) {
                let attrib = element.attributes[i];
                let name = attrib.name;
                if(obj.ceddl && name.indexOf('ceddl-') > -1) {
                    obj.ceddl[this.toCamelCase(name.replace('ceddl-', ''))] = attrib.value;
                }
            }
        }
        return obj;
    };

    /**
     * This function is a simplefied implementation of xpath
     * more info can be found in spec https://www.w3.org/TR/xpath/
     *
     * @param {Object} element from the DOM
     * @returns {String} unique string for a dom tree position.
     */
    Utils.prototype.perfXtagString = function(element) {
        var paths = [];
        var index = 0;
        var hasindex = false;

        // Use nodeName (instead of localName) so namespace prefix is included (if any).
        for (; element && element.nodeType == 1; element = element.parentNode) {
            index = 0;
            hasindex = false;
            if (element.previousSibling) {
                for (var sibling = element.previousSibling; sibling; sibling = sibling.previousSibling) {
                    // Ignore document type declaration.
                    if (sibling.nodeType == 10) {
                        continue;
                    }
                    if (sibling.nodeName == element.nodeName) {
                        hasindex = true;
                        ++index;
                    }
                }
            }
            // ie9 and up should work else change to nextsibling and check for text nodes.
            if (element.nextElementSibling && element.nextElementSibling.nodeName == element.nodeName) {
                hasindex = true;
            }

            var tagName = element.nodeName.toLowerCase();
            var pathIndex;
            if (element.id && element.id !== '') {
                pathIndex = '/*[@id="' + element.id + '"]';
                paths.splice(0, 0, pathIndex);
                break;
            } else {
                pathIndex = (hasindex ? "[" + (index + 1) + "]" : "");
                paths.splice(0, 0, tagName + pathIndex);
            }

        }

        return paths.length ? "/" + paths.join("/") : null;
    };

    /**
     * Creates a debounced function that delays invoking func until after wait
     * milliseconds have elapsed since the last time the debounced function was
     * invoked.
     *
     * @param {Function} func The function to debounce.
     * @param {number} [wait=0] wait is the number of milliseconds to delay.
     * @param {boolean} immediate event on invoke
     * @returns {Function} Returns the new debounced function.
     */
    Utils.prototype.debounce = function(func, wait, immediate) {
        var timeout, args, context, timestamp, result;
        if (null == wait) wait = 100;

        function later() {
            var last = Date.now() - timestamp;

            if (last < wait && last >= 0) {
                timeout = setTimeout(later, wait - last);
            } else {
                timeout = null;
                if (!immediate) {
                    result = func.apply(context, args);
                    context = args = null;
                }
            }
        }

        var debounced = function () {
            context = this;
            args = arguments;
            timestamp = Date.now();
            var callNow = immediate && !timeout;
            if (!timeout) timeout = setTimeout(later, wait);
            if (callNow) {
                result = func.apply(context, args);
                context = args = null;
            }

            return result;
        };

        return debounced;
    };



    var utils = (new Utils());

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
        var eventData = getClickEventData(element, { excludeCEDDLAttributes: true});

        this.ceddl.fireEvent(eventName, eventData);
    };

    /**
     * measureSubmit is adding the option to add a custom name to an event.
     * @param  {HTMLElement} element Form DOM element
     */
    ClickObserver.prototype.measureSubmit = function(element) {
        var attributes = utils.getAllElementsAttributes(element);
        var eventName = attributes.ceddl.submit || 'submit';
        var eventData = getsubmitEventData(element, { excludeCEDDLAttributes: true});

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

    var _clickObserver;

    function Base() {
        if (!(this instanceof Base)) {
            throw new TypeError('Must be constructed via new');
        }
    }

    /**
     * The initialize function makes it possible to allow async loading of the models
     * and initialize the html interface when ready.
     */
    Base.prototype.initialize = function() {
        _clickObserver = new ClickObserver(this);
        // _ceddlObserver = new CEDDLObserver(this, ModelFactory);
    };


    Base.prototype.fireEvent = function(name, data) {
        console.log(name, data);
    };

    window.CEDDL = new Base();

})));
