import {eventbus} from '../utils/eventbus.js';

/**
 * Simple store that saves events before dispatching them on the event bus.
 * Creates an instance of EventStore.
 * @memberof EventStore
 */
function EventStore() {
    this._eventStore = [];
}

/**
 * Returns the stored events with their name and data. Returns a copy of
 * the data by default, but can return the actual data if desired. The
 * event data is never cloned, as data comes from the user and might
 * contain circular references or functions.
 * @param {Boolean} [default=false] Flag indicating whether to return a
 * clone or the actual object.
 * @returns {Array<Object>}
 * @memberof EventStore
 */
EventStore.prototype.getStoredEvents = function(debug) {
    if (debug & debug === true) {
        return this._eventStore;
    }

    return this._eventStore.map(function(value) {
        return {
            name: value.name,
            data: value.data,
        };
    });
};

/**
 * Saves an event to the store before dispatching it on the event bus.
 * @param {String} name The name of the event.
 * @param {...any} data The event data.
 * @memberof EventStore
 */
EventStore.prototype.storeEvent = function(name, data) {
    this._eventStore.push({
        name: name,
        data: data,
    });
    eventbus.emit('ceddl:events', this._eventStore);
    eventbus.emit(name, data);
};


/**
 * Clears all events from the store but keeps the reference intact.
 * @memberof EventStore
 */
EventStore.prototype.clearStore = function() {
    this._eventStore.splice(0, this._eventStore.length);
};


export { EventStore };
