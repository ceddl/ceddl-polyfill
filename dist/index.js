(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (factory());
}(this, (function () { 'use strict';

    /**
     * Defines an abstract data model
     * Creates an instance of Model.
     * @param {Array} args model fields
     * @memberof Model
     */
    function Model(args) {
        this._args = args;
        this.fields = {};
    }
    Model.prototype.setField = function(key, fieldObj) {
        this.fields[key] = fieldObj;
    };

    Model.prototype.getValue = function() {
        const validation = this.validate();
        if (validation.valid) {
            var data = {};

            for (var key in this.fields) {
                var field = this.fields[key];
                var value = field.getValue();
                if (value !== null && value !== undefined) {
                    data[key] = value;
                }
            }

            return data;
        } else {
            return {error: 'Cant get values from an invalid Model'};
        }
    };

    /**
     * Validate the model
     *
     * @returns {{valid: boolean, errors: Array, warnings: Array}}
     * @memberof Model
     */
    Model.prototype.validate = function() {
        var errors = [],
            warnings = [];

        for (var key in this.fields) {
            var field = this.fields[key];
            var fieldErrors = field.getErrors();
            var fieldWarnings = field.getWarnings();
            if (fieldErrors) {
                errors.push({
                    field: key,
                    msg: fieldErrors
                });
            }
            if (fieldWarnings) {
                warnings.push({
                    field: key,
                    msg: fieldWarnings
                });
            }
        }

        return {
            valid: errors.length <= 0,
            errors: errors,
            warnings: warnings
        }
    };

    /**
     * Defines an abstract model field
     * Creates an instance of Field.
     * @param {string} key Key for mapping value to dataLayer
     * @param {any} value Field value
     * @param {boolean} required Is the field required?
     * @memberof Field
     */
    function Field (key, value, required) {
        if ((value === undefined || value === null || value.length <= 0) && required) {
            /**
             * Will be set if something is wrong with the value passed to the field
             * @public
             */
            this.warning = 'Required field ' + key + ' not set';
        }

        /**
         * The key for the key-value pair in the final dataObject
         * @public
         */
        this.key = key;

        /**
         * The inner value of the field
         * @public
         */
        this.value = value;
    }

    Field.isFlat = function() {
        return true;
    };

    Field.isList = function() {
        return false;
    };

    /**
     * Get the inner value of the field. Primarily here to be overridden by ModelField and ListField
     *
     * @returns {any} value
     * @memberof Field
     */
    Field.prototype.getValue = function() {
        return this.value;
    };

    /**
     * Get the field's error message
     *
     * @returns {string} error message
     * @memberof Field
     */
    Field.prototype.getErrors = function() {
        return this.error;
    };

    /**
     * Get the field's warning message
     *
     * @returns {string} warning message
     * @memberof Field
     */
    Field.prototype.getWarnings = function() {
        return this.warning;
    };

    /**
     * Create a StringField on a model to vaidate a string value
     * Creates an instance of StringField.
     * @param {any} key
     * @param {any} value
     * @param {any} required
     * @param {string} choices Choices for the field separated by a pipe (|)
     * @memberof StringField
     */
    function StringField(key, value, required, choices) {
        Field.call(this, key, value, required);
        this._choices = choices && choices.split('|') || null;

        if (value !== null && value !== undefined && typeof value !== 'string') {
            this.warning = `Invalid value for StringField ${key}: ${value}`;
        }

        if (value === "undefined") {
            this.warning = `Invalid value for StringField ${key}: ${value}`;
        }

        if (value && choices && this._choices.indexOf(value) <= -1) {
            this.warning = `Invalid value for StringField ${key}, should be ${choices}`;
        }
    }

    StringField.isFlat = function() {
        return true;
    };

    StringField.isList = function() {
        return false;
    };

    StringField.prototype = Object.create(Field.prototype);
    StringField.prototype.constructor = StringField;

    /**
     * Create a BooleanField on a model to validate a boolean value
     * Creates an instance of BooleanField.
     * @param {string} key Key of the field sent to analytics
     * @param {boolean} value The value of the field
     * @param {boolean} required Is the field required?
     * @memberof BooleanField
     */
    function BooleanField(key, value, required) {
        Field.call(this, key, value, required);
        var _trueStrings = ['true', 'TRUE', 'True'];
        var _falseStrings = ['false', 'FALSE', 'False'];
        var _allowedStrings = [].concat(_trueStrings, _falseStrings);

        if (value !== undefined && value !== null && (typeof value === 'boolean' || _allowedStrings.indexOf(value) > -1)) {
            if (typeof value === 'string') {
                if (_trueStrings.indexOf(value) > -1) {
                    this.value = true;
                } else {
                    this.value = false;
                }
            } else {
                this.value = value;
            }
        } else {
            if (value !== undefined && value !== null && typeof value !== 'boolean') {
                this.warning = 'Invalid value for BooleanField ' + key + ': ' + value;
            }
        }
    }

    BooleanField.isFlat = function() {
        return true;
    };

    BooleanField.isList = function() {
        return false;
    };

    BooleanField.prototype = Object.create(Field.prototype);
    BooleanField.prototype.constructor = BooleanField;

    /**
     * Create a ModelField on a Model to nest the instance of another model in the field
     * Creates an instance of ModelField.
     * @param {Model} model The model of the to be nested data
     * @param {string} key Key for mapping data to the dataLayer
     * @param {Object} value Key-value map for creating model instance
     * @param {boolean} required Is the field required?
     * @memberof ModelField
     */
    function ModelField(model, key, value, required) {
        Field.call(this, key, value, required);
        if (value) {
            try {
                this._object = new model(value);
            } catch(e) {
                /**
                 * The field's error message
                 *
                 * @public
                 */
                this.warning = `${model} is not a valid Model`;
            }
        } else {
            this._object = null;
        }
    }

    ModelField.isFlat = function() {
        return false;
    };

    ModelField.isList = function() {
        return false;
    };

    ModelField.prototype = Object.create(Field.prototype);
    ModelField.prototype.constructor = ModelField;

    ModelField.prototype.getValue = function() {
        return this._object ? this._object.getValue() : {};
    };

    /**
     * Get a list of errors from the model's fields, prepended by own error Object
     *
     * @returns {Array.<{field: string, msg: string}>} List of error Objects
     * @memberof ModelField
     */
    ModelField.prototype.getErrors = function() {
        let errors = [];
        if (this.error) {
            errors.push({
                field: this.key,
                msg: this.error
            });
        }

        if (this._object) {
            let validator = this._object.validate();
            if (validator.errors.length > 0) {
                errors.push(...validator.errors);
            }
        }

        return (errors.length > 0 && errors) || null;
    };

    /**
     * Get a list of warnings from the model's fields, prepended by own warning Object
     *
     * @returns {Array.<{field: string, msg: string}>} List of warning Objects
     * @memberof ModelField
     */
    ModelField.prototype.getWarnings = function() {
        let warnings = [];
        if (this.warning) {
            warnings.push({
                field: this.key,
                msg: this.warning
            });
        }

        if (this._object) {
            let validator = this._object.validate();
            if (validator.warnings.length > 0) {
                warnings.push(...validator.warnings);
            }
        }

        return (warnings.length > 0 && warnings) || null;
    };

    /**
     * Create a ListField on a model to create a relation between that model and many instances of another Model
     * Creates an instance of ListField.
     * @param {Model} model The Model type for the relation
     * @param {string} key Key for the value sent to dataLayer
     * @param {Array} list List of objects for converting to Model instances
     * @param {boolean} required Is the field required?
     * @memberof ListField
     */
    function ListField (model, key, list, required, ModelFactory) {
        Field.call(this, key, list, required);
        this._items = [];
        if (list) {
            for (var item of list) {
                try {
                    if (item._model) {
                        this._items.push(new ModelFactory.models[item._model](item));
                    } else {
                        this._items.push(new model(item));
                    }
                } catch(e) {
                    /**
                     * The field's error message
                     *
                     * @public
                     */
                    if (item._model) {
                        this.warning = item._model + ' is not a valid Model';
                    } else {
                        this.warning = model + ' is not a valid Model';
                    }

                }
            }
        }
    }

    ListField.isFlat = function() {
        return false;
    };

    ListField.isList = function() {
        return true;
    };

    ListField.prototype = Object.create(Field.prototype);
    ListField.prototype.constructor = ListField;

    /**
     * Get the values of all the instances in the list combined
     *
     * @returns {Object} values
     * @memberof ListField
     */
    ListField.prototype.getValue = function() {
        var data = [];

        for (var item of this._items) {
            data.push(item.getValue());
        }

        return data;
    };

    /**
     * Get list of errors from models in the list, prepended by own error Object
     *
     * @returns {Array.<{field: string, msg: string}>} List of error Objects
     * @memberof ListField
     */
    ListField.prototype.getErrors = function() {
        var errors = [];

        if (this.error) {
            errors.push({
                field: this.key,
                msg: this.error
            });
        }

        for (var item of this._items) {
            var validator = item.validate();
            if (validator.errors.length > 0) {
                errors.push(...validator.errors);
            }
        }

        return (errors.length > 0 && errors) || null;
    };

    /**
     * Get list of warnings from models in the list, prepended by own warning Object
     *
     * @returns {Array.<{field: string, msg: string}>} List of warning Objects
     * @memberof ListField
     */
    ListField.prototype.getWarnings = function() {
        var warnings = [];

        if (this.warning) {
            warnings.push({
                field: this.key,
                msg: this.warning
            });
        }

        for (var item of this._items) {
            var validator = item.validate();
            if (validator.warnings.length > 0) {
                warnings.push(...validator.warnings);
            }
        }

        return (warnings.length > 0 && warnings) || null;
    };

    /**
     * Create a NumberField on a model to validate a number value
     * Creates an instance of NumberField.
     * @param {string} key The field's key for sending to analytics
     * @param {number} value The field's value
     * @param {boolean} required Is the field required?
     * @memberof NumberField
     */
    function NumberField(key, value, required) {
        Field.call(this, key, value, required);
        if (value) {
            this.value = parseFloat(value);

            if (isNaN(this.value)) {
                this.warning = `Invalid value for NumberField ${key}: ${value}`;
                this.value = false; // prevent a NaN
            }
        }
    }

    NumberField.isFlat = function() {
        return true;
    };

    NumberField.isList = function() {
        return false;
    };

    NumberField.prototype = Object.create(Field.prototype);
    NumberField.prototype.constructor = NumberField;

    function ArrayField(field, key, list, required) {
        Field.call(this, key, list, required);
        this._items = [];
        if (list) {
            for (let i in list) {
                let item = list[i];
                try {
                    this._items.push(new field(key+i, item, true));
                } catch(e) {
                    /**
                     * The field's error message
                     *
                     * @public
                     */
                    // TODO: fix warning message
                    this.warning = `${field} is not a valid field`;
                }
            }
        }
    }

    ArrayField.isFlat = function() {
        return true;
    };

    ArrayField.isList = function() {
        return false;
    };

    ArrayField.prototype = Object.create(Field.prototype);
    ArrayField.prototype.constructor = ArrayField;

    /**
     * Fetch field errors
     *
     * @returns {Array.<{field: string, msg: string}>} List of error Objects
     * @memberof ArrayField
     */
    ArrayField.prototype.getErrors = function() {
        var errors = [];

        if (this.error) {
            errors.push({
                field: this.key,
                msg: this.error
            });
        }

        for (var item of this._items) {
            var error = item.getErrors();
            if (error) {
                errors.push({
                    field: item.key,
                    msg: error,
                });
            }
        }

        return (errors.length > 0 && errors) || null;
    };

    /**
     * Get list of warnings from models in the list, prepended by own warning Object
     *
     * @returns {Array.<{field: string, msg: string}>} List of warning Objects
     * @memberof ArrayField
     */
    ArrayField.prototype.getWarnings = function() {
        var warnings = [];

        if (this.warning) {
            warnings.push({
                field: this.key,
                msg: this.warning
            });
        }

        for (var item of this._items) {
            var warning = item.getWarnings();
            if (warning) {
                warnings.push({
                    field: item.key,
                    msg: warning,
                });
            }
        }

        return (warnings.length > 0 && warnings) || null;
    };

    // import logger from '../logger';

    /**
     * Class for creating models
     *
     * @class ModelFactory
     */

    function ModelFactory () {
        this.models = {};
    }
    /**
     * getter function exposing all the field types on the modelfactory api
     */
    Object.defineProperty(ModelFactory.prototype, "fields", {
        get: function fields() {
            return {
                StringField: StringField,
                BooleanField: BooleanField,
                ModelField: ModelField,
                ListField: ListField,
                NumberField: NumberField,
                ArrayField: ArrayField,
            };
        }
    });

    /**
     * Create a new model for validating data
     *
     * @param {Object} modelArgs
     * @param {string} modelArgs.key The model identifier
     * @param {Array.<{type: Field, foreignModel?: Model, required: boolean}>} modelArgs.fields The model's fields
     * @returns {Model} The created model
     * @memberof ModelFactory
     */
    ModelFactory.prototype.create = function(modelArgs) {
        var mf = this;
        let model = function(values) {
            let myModel;
            if (modelArgs.extends) {
                myModel = new mf.models[modelArgs.extends](values);
            } else {
                myModel = new Model(values);
                myModel.fields = {};
            }

            for (let key in modelArgs.fields) {
                let field = modelArgs.fields[key];

                if (field.type) {
                    // TODO: Refactor weird if statements
                    if (field.type === ModelField || field.type === ListField) {

                        let foreignModel = mf.models[field.foreignModel];
                        if (foreignModel) {
                            myModel.fields[key] = new field.type(foreignModel, key, values[key], field.required, field.choices);
                        }
                    } else if (field.type === ArrayField) {
                        myModel.fields[key] = new field.type(field.fieldType, key, values[key], field.required, field.choices);
                    } else {
                        myModel.fields[key] = new field.type(key, values[key], field.required, field.choices);
                    }
                }
            }

            return myModel;
        };

        model.getFields = function() {
            let fields = {};
            if (modelArgs.extends) {
                fields = new mf.models[modelArgs.extends].getFields();
            }

            Object.assign(fields, modelArgs.fields);
            return fields;
        };

        model.isRoot = function() {
           return modelArgs.root ? modelArgs.root : false;
        };

        mf.models[modelArgs.key] = model;

        return model;
    };

    var PassModelFactory = (new ModelFactory());

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

    /**
     * @desc This observer intended to monitor and receive analytics data from html.
     * It will listen and process changes in the dom and push the data to ceddl.
     * Creates an instance of the ceddl observer.
     * @param {Object} ceddl class
     * @param {Object} ceddl ModelFactory
     */
    function CeddlObserver(ceddl, ModelFactory) {
        this.ceddl = ceddl;

        this.ModelFactory = ModelFactory;
        this.debouncedGenerateModelObjectsCall = utils.debounce(() => {
            this.generateModelObjects();
        }, 100);
        utils.pageReady(() => {
            this.init();
        });
    }

    /**
     * GetElementAttributes is a recursive function looping over the DOM.
     * A function whose implementation references itself. looping over the ceddl model
     * structure searching for models inside itself an creating one object for evenry root element
     *
     * @param  {string} modelName of the current position in the model structure
     * @param  {[type]} el dom element of the current position in the model structure
     * @return {object} object containing attrubute data that is structure accoding the ceddl models
     */
    CeddlObserver.prototype.getElementAttributes = function(modelName, el) {
        var fields = this.ModelFactory.models[modelName].getFields();
        var elAttr = utils.getAllElementsAttributes(el);
        var object = {};

        if (el === null) {
            return undefined;
        }

        if (elAttr.ceddl.model) {
            object['model'] = elAttr.ceddl.model;
        }

        for (var key in fields) {
            var field = fields[key];
            if (field.type.isFlat()) {
                if (elAttr[key]) {
                    object[key] = elAttr[key];
                }
            } else if (field.type.isList()) {
                var elements = el.querySelectorAll('[ceddl-observe=' + field.foreignModel + ']');
                object[key] = [];
                for (var item of elements) {
                    var model = item.getAttribute('ceddl-model');
                    object[key].push(this.getElementAttributes(model || field.foreignModel, item));
                }
            } else {
                var element = el.querySelector('[ceddl-observe=' + key + ']');
                if (element) {
                    object[key] = this.getElementAttributes(field.foreignModel, element);
                }
            }
        }

        return object;
    };

    /**
     * GenerateModelObjects is a helper function to collect all data from the page
     * It finds modelnames that are a ceddl model designated as "root" and will start
     * a recursive function finding all the models inside every root element.
     */
    CeddlObserver.prototype.generateModelObjects = function() {
        var rootModels = [];
        var dataObj;
        for (var model in this.ModelFactory.models) {
            if (this.ModelFactory.models[model].isRoot()) {
                rootModels.push(model);
            }
        }

        rootModels.forEach((modelName) => {
            dataObj = this.getElementAttributes(modelName, document.querySelector('[ceddl-observe="' + modelName + '"]'));
            this.ceddl.pushToDataObject(modelName, dataObj);
        });
    };

    /**
     * Sets a mutation observer on body listening to attribute, dom child changes and
     * subtree position changes. The callback of the observer is debounced so that
     * frameworks can change the dom in rapid succession without resulting in an overload
     * of javascript activity.
     *
     * @see https://developer.mozilla.org/nl/docs/Web/API/MutationObserver
     */
    CeddlObserver.prototype.setListeners = function() {
        var ceddlObserver = new MutationObserver(this.debouncedGenerateModelObjectsCall);
        var config = { attributes: true, childList: true, subtree: true, characterData: false };
        ceddlObserver.observe(document.body, config);
    };

    /**
     * After pageload the init function initialise a mutation observer
     * starting a initial generation loop.
     */
    CeddlObserver.prototype.init = function() {
        this.setListeners();
        this.generateModelObjects();
    };

    var _clickObserver, _ceddlObserver;

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
        _ceddlObserver = new CeddlObserver(this, PassModelFactory);
    };

    Base.prototype.fireEvent = function(name, data) {
        console.log(name, data);
    };

    Base.prototype.pushToDataObject = function(name, data) {
        console.log(name, data);
    };

    /**
     * Get the model factory
     *
     * @readonly
     * @static
     * @memberof CEDDL
     * @returns {Object} ModelFactory
     */
    Object.defineProperty(Base.prototype, "ModelFactory", {
        get: function ModelFactory() {
           return PassModelFactory;
        }
    });

    window.CEDDL = new Base();

})));
