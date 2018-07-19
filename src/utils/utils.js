"use strict";

/**
 * Singleton Class for instantiating utillity's. Functiuns need to be
 * functional / performant and stateless to promote re-use
 *
 * @export
 * @class DataMohoUtils
 */
var Utils = function () {

    /**
     * [isDate description]
     * @param  {[type]}  d [description]
     * @return {Boolean}   [description]
     */
    function isDate(d) {
        return d instanceof Date;
    }

    /**
     * [isEmpty description]
     * @param  {[type]}  o [description]
     * @return {Boolean}   [description]
     */
    function isEmpty(o) {
        return Object.keys(o).length === 0;
    }

    /**
     * [isObject description]
     * @param  {[type]}  o [description]
     * @return {Boolean}   [description]
     */
    function isObject(o) {
        return o != null && o instanceof Object;
    }

    /**
     * [properObject description]
     * @param  {[type]} o [description]
     * @return {[type]}   [description]
     */
    function properObject(o) {
        if (this.isObject(o) && !o.hasOwnProperty) {
            return Object.assign({}, o);
        } else {
            return o
        }
    }

    /**
     * isArrayOfStrings
     * @param  {object} o
     * @return {boolean}
     */
    function isArrayOfStrings(o) {
        if (toString.call(o) != '[object Array]') {
            return false;
        }
        for(var i=0;i<o.length;i++){
           if(typeof o[i] !== 'string')
              return false;
        }
        return true;
    }

    /**
     * A very naive deep clone that's specifically used to clone DataMoho
     * model objects, as these will never contain complex data like functions
     * or date objects.
     * @param {(Object|Array)} target Data to be cloned.
     * @returns {(Object|Array)}
     * @memberof DataMohoUtils
     */
    function simpleDeepClone(target) {
        const isArray = Array.isArray(target);
        const isObject = !isArray && this.isObject(target);

        if (isArray) {
            return target.map(this.simpleDeepClone.bind(this));
        } else if (isObject) {
            return Object.keys(target).reduce((acc, key) => {
                acc[key] = this.simpleDeepClone(target[key]);
                return acc;
            }, {});
        } else {
            // The value must be a primitive.
            return target;
        }
    }

    /**
     * The purpose of this function is to deep diff two objects.
     * It will compare two objects and then output an object with
     * all the changes between them including removed and added pointers.
     * Performance was a important consideration for chosing this function.
     *
     * Unfortunately on writing this documentation i can not find the post
     * this code originated from. It has been changed slightly sinds then.
     *
     * @param {Object} lhs Left hand side object.
     * @param {Object} rhs Right hand side object.
     * @returns {Object} Returns a object containing pointers and values
     * that have changed between lhs and rhs.
     */
    function diff(lhs, rhs) {
        if (lhs === rhs) {
           return {}; // equal return no diff
        }

        if (!this.isObject(lhs) || !this.isObject(rhs)) {
            return rhs; // return updated rhs
        }

        const l = this.properObject(lhs);
        const r = this.properObject(rhs);

        const deletedValues = Object.keys(l).reduce((acc, key) => {
            return r.hasOwnProperty(key) ? acc : Object.assign(acc, {[key]: undefined});
        }, {});

        if (this.isDate(l) || this.isDate(r)) {
            if (l.valueOf() == r.valueOf()) {
                return {};
            }
            return r;
        }

        return Object.keys(r).reduce((acc, key) => {
            if (!l.hasOwnProperty(key)) {
                return Object.assign(acc, {[key]: r[key]}); // return added r key
            }

            const difference = this.diff(l[key], r[key]);

            if (this.isObject(difference) && this.isEmpty(difference) && !this.isDate(difference)) {
                return acc; // return no diff
            }

            return Object.assign(acc, {[key]: difference}); // return updated key
        }, deletedValues);
    }

    /**
     * Document ready function. Will resolve immidiatly if DOM has already loaded
     *
     * @param {Function} callback function
     */
    function pageReady(callback) {
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
    }

    /**
     * low resource way of obtaining all related attributes.
     *
     * @param {Object} element from the DOM
     * @returns {Object} atribute data without prefixes
     */
    function getAllElementsAttributes(element, opt) {

    }

    /**
     * This function is a simplefied implementation of xpath
     * more info can be found in spec https://www.w3.org/TR/xpath/
     *
     * @param {Object} element from the DOM
     * @returns {String} unique string for a dom tree position.
     */
    function perfXtagString(element) {
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
    }

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
    function debounce(func, wait, immediate) {
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
    }

    return {
        isDate,
        isEmpty,
        isObject,
        properObject,
        isArrayOfStrings,
        simpleDeepClone,
        diff,
        pageReady,
        getAllElementsAttributes,
        perfXtagString,
        debounce
    }

}

export default (new Utils());
