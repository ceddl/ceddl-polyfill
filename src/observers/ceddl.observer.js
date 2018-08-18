import utils from '../utils/utils';

/**
 * @desc This observer intended to monitor and receive analytics data from html.
 * It will listen and process changes in the dom and push the data to ceddl.
 * Creates an instance of the ceddl observer.
 * @param {Object} ceddl class
 * @param {Object} ceddl ModelFactory
 */
function CeddlObserver(ceddl, ModelFactory) {
    var that = this;
    this.ceddl = ceddl;

    this.ModelFactory = ModelFactory;
    this.debouncedGenerateModelObjectsCall = utils.debounce(function() {
        that.generateModelObjects();
    }, 100);
    utils.pageReady(function() {
        that.init();
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
    var item;

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
            for (var i = 0; i < elements.length; i++) {
                item = elements[i];
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
    var that = this;

    for (var model in this.ModelFactory.models) {
        if (this.ModelFactory.models[model].isRoot()) {
            rootModels.push(model);
        }
    }

    rootModels.forEach(function (modelName) {
        dataObj = that.getElementAttributes(modelName, document.querySelector('[ceddl-observe="' + modelName + '"]'));
        that.ceddl.pushToDataObject(modelName, dataObj);
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

export default CeddlObserver;
