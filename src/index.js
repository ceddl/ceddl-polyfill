import {Logger, Eventbus} from './utils/eventbus.js';
import { ModelFactory } from './models/model-factory.js';
import { ModelStore } from './stores/modelStore.js';
import { EventStore } from './stores/eventStore.js';
import { ClickObserver } from './observers/click.observer.js';
import { CeddlObserver } from './observers/ceddl.observer.js';

var _modelStore, _eventStore, _clickObserver, _CeddlObserver;

/**
 * Method used for printing field errors on models
 * @param {String} key The key of the field
 * @param {Object} errors List of field errors or string containing error
 */
function _printFieldErrors(key, errors) {
    var error;
    for (var i = 0; i < errors.length; i++) {
        error = errors[i];
        if (Array.isArray(error.msg)) {
            _printFieldErrors(key + '.' + error.field, error.msg);
        } else {
            var message = key+'.'+error.field+': '+error.msg;
            Logger.field(message);
        }
    }
}

function Ceddl() {
    _modelStore = new ModelStore();
    _eventStore = new EventStore();
}

/**
 * The initialize function makes it possible to allow async loading of the models
 * and initialize the html interface when ready.
 */
Ceddl.prototype.initialize = function() {
    if(!_clickObserver && !_CeddlObserver) {
        _clickObserver = new ClickObserver(this);
        _CeddlObserver = new CeddlObserver(this, ModelFactory);
    } else {
        _modelStore.clearStore();
        _eventStore.clearStore();
        Eventbus.clearHistory();
        _CeddlObserver.generateModelObjects();
        Eventbus.emit('initialize');
    }

};

Ceddl.prototype.emitEvent = function(name, data) {
    _eventStore.storeEvent(name, data);
};

Ceddl.prototype.emitModel = function(name, data) {
    var model = ModelFactory.models[name];
    if (!model) {
        Logger.field('Model does not exist for key: ' + name);
        return;
    }

    // A undefined value signals a deleted item.
    if (data === undefined) {
        _modelStore.storeModel(name, data);
        return;
    }

    var object = new ModelFactory.models[name](data);
    var validator = object.validate();

    if (validator.valid) {
        _modelStore.storeModel(name, object.getValue());
    } else {
       _printFieldErrors(name, validator.errors);
    }
};


/**
 * Returns all stored models.
 * @returns {Object}
 */
Ceddl.prototype.getModels = function() {
    return _modelStore.getStoredModels();
};

/**
 * Returns all stored events.
 * @returns {Array}
 */
Ceddl.prototype.getEvents = function() {
    return _eventStore.getStoredEvents();
};

/**
 * Get the model factory
 *
 * @readonly
 * @static
 * @returns {Object} ModelFactory
 */
Object.defineProperty(Ceddl.prototype, "modelFactory", {
    get: function modelFactory() {
       return ModelFactory;
    }
});

/**
 * Get the eventbus
 *
 * @readonly
 * @returns {Object} Eventbus
 */

Object.defineProperty(Ceddl.prototype, "eventbus", {
    get: function eventbus() {
       return Eventbus;
    }
});

export default (new Ceddl());
