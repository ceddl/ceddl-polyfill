import utils from './utils/utils.js';
import eventBus from './utils/eventbus.js';
import logger from './utils/logger.js';
import passEventbus from './utils/eventbus';
import PassModelFactory from './models/model-factory.js';
import ModelStore from './stores/modelStore';
import EventStore from './stores/eventStore';
import ClickObserver from './observers/click.observer.js';
import CEDDLObserver from './observers/ceddl.observer.js';

var _clickObserver, _ceddlObserver, _modelStore, _eventStore;


/**
 * Method used for printing field errors on models
 * @param {String} key The key of the field
 * @param {Object} errors List of field errors or string containing error
 * @memberof DataMoho
 */
function _printFieldErrors(key, errors) {
    for (let error of errors) {
        if (Array.isArray(error.msg)) {
            _printFieldErrors(key + '.' + error.field, error.msg);
        } else {
            var message = 'Fielderror: '+key+'.'+error.field+': '+error.msg;
            logger.warn(message);
            eventBus.emit('CEDDL:Fielderror', {
                exDescription: message,
                exFatal: false,
            });
        }
    }
}


function Base() {
    _modelStore = new ModelStore();
    _eventStore = new EventStore();
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
    var model = PassModelFactory.models[name];
    if (!model) {
        this._logWarning('Model does not exist for key: ' + name);
        return;
    }

    // A undefined value signals a deleted item.
    if (data === undefined) {
        _modelStore.pushModel(name, data);
        return;
    }

    const object = new PassModelFactory.models[name](data);
    const validator = object.validate();

    if (validator.valid) {
        _modelStore.storeModel(name, object.getValue());
    } else {
       _printFieldErrors(name, validator.errors)
    }
}


/**
 * Returns all stored models.
 * @returns {Object}
 * @memberof DataMoho
 */
Base.prototype.getModels = function() {
    return _modelStore.getStoredModels();
}

/**
 * Returns all stored events.
 * @returns {Array}
 * @memberof DataMoho
 */
Base.prototype.getEvents = function() {
    return _eventStore.getEvents();
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

/**
 * Get the eventbus
 *
 * @readonly
 * @memberof DataMoho
 * @returns {Object} Eventbus
 */
Object.defineProperty(Base.prototype, "eventbus", {
    get: function eventbus() {
       return passEventbus;
    }
});

window.CEDDL = new Base();
