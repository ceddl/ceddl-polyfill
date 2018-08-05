import PassModelFactory from './models/model-factory.js';
import utils from './utils/utils.js';
import ClickObserver from './observers/click.observer.js';
import CEDDLObserver from './observers/ceddl.observer.js';

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
    _ceddlObserver = new CEDDLObserver(this, PassModelFactory);
}

Base.prototype.fireEvent = function(name, data) {
    console.log(name, data);
}

Base.prototype.pushToDataObject = function(name, data) {
    console.log(name, data);
}

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
