import utils from '../utils/utils';
import {eventbus} from '../utils/eventbus';

/**
 * Publish a delta event on the event bus with all nested data that changed.
 * Recursively moves through the delta to also publish the smallest changes
 * under a specific eventName.
 * @param {String} eventName The name of the delta event.
 * @param {(Object|Array)} data The delta that needs to be dispatched.
 *
 * emitPropertyEvents('model', {
 *      a: 'b',
 *      c: [
 *          { d: 1 },
 *          { d: 2 }
 *      ],
 *      e: {
 *          f: true
 *      }
 * });
 * // Will dispatch the following events:
 * 'model' -> { a: 'b', c: [{ d: 1 }, { d: 2 }] e: { f: true } }
 * 'model.a' -> 'b'
 * 'model.c' -> [{ d: 1 }, { d: 2 }]
 * 'model.c.0' -> { d: 1 }
 * 'model.c.0.d' -> 1
 * 'model.c.1' -> { d: 2 }
 * 'model.c.1.d' -> 2
 * 'model.e' -> { f: true }
 * 'model.e.f' -> true
 */
function emitPropertyEvents(eventName, diff, baseKey, store) {
    if(store && store[baseKey] !== undefined && store[baseKey] !== null) {
       eventbus.emit(eventName, store[baseKey]);
    } else {
       eventbus.emit(eventName, undefined);
    }

    if (Array.isArray(diff)) {
        diff.forEach((item, index) => {
            emitPropertyEvents(`${eventName}.${index}`, item, index, store[baseKey]);
        });
    } else if (diff === Object(diff)) {
        Object.keys(diff).forEach((key) => {
            const child = diff[key];
            emitPropertyEvents(`${eventName}.${key}`, child, key, store[baseKey]);
        });
    }
}

/**
 * Model store that keeps saves models and dispatches delta events on the event
 * bus when a model is updated.
 * Creates an instance of ModelStore.
 * @memberof ModelStore
 */
function ModelStore() {
    this._modelStore = {};
}

/**
 * Returns the stored objects as a collection. Returns a copy of the data
 * by default, but can return the actual data if desired.
 * @param {Boolean} [default=false] Flag indicating whether to return a
 * clone or the actual object.
 * @returns {Object}
 * @memberof ModelStore
 */
ModelStore.prototype.getStoredModels = function(debug) {
    if (debug & debug === true) {
        return this._modelStore;
    }

    return utils.simpleDeepClone(this._modelStore);
}

/**
 * Stores or updates a model for a specific key. The new model is then
 * diffed against the old model. When there are changes the entire store
 * will be dispatched, as well as events for all levels of the diff.
 * @param {String} key They key under which to store or update the model.
 * @param {Object} data Model to be stored.
 * @memberof ModelStore
 */
ModelStore.prototype.storeModel = function(key, data) {
    // If there was no previous model use an empty object to generate the diff.
    const existingModel = this._modelStore[key] || {};
    // If there is no new data use an empty object to generate the diff.
    const newData = data ||{};

    const diff = utils.diff(existingModel, newData);

    if (data) {
        this._modelStore[key] = data;
    } else {
        delete this._modelStore[key];
    }

    if (!utils.isEmpty(diff)) {
        eventbus.emit('ceddl:models', this.getStoredModels());
        emitPropertyEvents(`${key}`, diff, key, this.getStoredModels());
    }

}

/**
 * Clears all models from the store while keeping the reference intact.
 * @memberof ModelStore
 */
ModelStore.prototype.clearStore = function() {
    Object.keys(this._modelStore).forEach((key) => {
        delete this._modelStore[key];
    });
}


export default ModelStore;
