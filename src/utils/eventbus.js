// Private variables
var _values = {};
var _events;
var logger = new Logger();
var eventbus = new Eventbus();

/**
 * @desc An EventBus is responsible for managing a set of listeners and publishing
 * events to them when it is told that such events happened. In addition to the
 * data for the given event it also sends a event control object which allows
 * the listeners/handlers to prevent the default behavior of the given event.
 *
 * The EventBus is designed to be generic enough to support all the different
 * contexts in which one might want to emit events.
 */
function Eventbus() {}

/**
 * Returns the correct callback array, or create a new one should it not
 * exist yet.
 * @param {String} name The name of the event.
 * @returns {Array<Object>}
 * @memberof Eventbus
 */
Eventbus.prototype.prepareEvent = function(name) {
    if (!_events) _events = {};
    if (!_events[name]) _events[name] = [];
    return _events[name];
};

/**
 * Remove a specific callback from an event, or remove all callbacks from an
 * event by not passing a function and scope. When removing bound functions
 * you must also pass the correct scope.
 * @param {String} name Name of the event remove listeners from.
 * @param {Function?} callback Function to remove from callback list.
 * @param {any?} scope Scope the supplied callback was bound to.
 */
Eventbus.prototype.off = function(name, callback, scope) {
    var events = this.prepareEvent(name);

    if (callback) {
        for (var i = events.length - 1; i >= 0; i--) {
            var existingCb = events[i].callback;
            var existingScope = events[i].scope;

            if (callback === existingCb && scope === existingScope) {
                events.splice(i, 1);
            }
        }
    } else {
        delete _events[name];
    }
};

/**
 * Adds a listener to be invoked when events of the specified type are
 * emitted. An optional calling context may be provided. The data arguments
 * emitted will be passed to the listener function.
 *
 * @param {String} name - Name of the event to listen to
 * @param {Function} callback - Function to invoke when the specified event is
 *   emitted
 * @param {any} scope - Optional context object to use when invoking the
 *   listener
 */
Eventbus.prototype.on = function(name, callback, scope) {
    if (_values[name]) {
        try {
            callback.apply(scope || this, _values[name]);
        } catch(error) {
            logger.error(error.message);
        }
    }

    this.prepareEvent(name).push({ callback: callback, scope: scope });
};

/**
 * Similar to on, except that the listener is removed after it is
 * invoked once.
 *
 * @param {String} name - Name of the event to listen to
 * @param {Function} callback - Function to invoke only once when the
 *   specified event is emitted
 * @param {any} scope - Optional context object to use when invoking the
 *   listener
 */
Eventbus.prototype.once = function(name, callback, scope) {
    if (_values[name]) {
        try {
            callback.apply(scope || this, _values[name]);
        } catch(error) {
            logger.error(error.message);
        }
    } else {
        this.prepareEvent(name).push({ callback: callback, scope: scope, once: true });
    }
};

/**
* Emits an event of the given type with the given data. All handlers of that
* particular type will be notified. Arbitrary arguments can be passed
* in many forms and will be forwarded to the listeners
*
* @param {string} name - Name of the event to emit
* @param {...any} args Arguments to pass through to the listeners.
* @example
*   eventbus.on('someEvent', function(message) {
*     console.log(message);
*   });
*
*   eventbus.emit('someEvent', 'abc'); // logs 'abc'
*/
Eventbus.prototype.emit = function(name, arg) {
    var events = this.prepareEvent(name).slice();
    var args;
    for (var j = 1, lengthj = arguments.length; j < lengthj; j++) {
        if (!args) {
            args = [];
        }
        args.push(arguments[j]);
    }

    _values[name] = args;
    for (var i = 0, lengthi = events.length; i < lengthi; i++) {
        var callback = events[i].callback;
        var scope = events[i].scope || this;

        try {
            callback.apply(scope, args);
        } catch (error) {
            logger.error(error.message);
        }

        if(events[i].once) {
            this.off(name, callback, events[i].scope);
        }
    }
};


/**
 * Deletes all previous emits. Useful to prevent newly registered callbacks
 * from firing with old data.
 * @memberof Eventbus
 */
Eventbus.prototype.clearHistory = function() {
    Object.keys(_values).forEach(function (key) {
        delete _values[key];
    });
};

function logAndEmit(level, message) {
    if(!message || message === '') {
        return;
    }
    message = 'ceddl:'+level+' '+message;

    if(console && console.log) {
        switch(level) {
            case 'info':
                console.info ? console.info(message) : console.log(message);
                break;
            case 'warn':
                console.warn ? console.warn(message) : console.log(message);
                break;
            case 'field':
                console.warn ? console.warn(message) : console.log(message);
                break;
            case 'error':
                console.error ? console.error(message) : console.log(message);
                break;
            default:
                console.log(message);
        }
    }


    eventbus.emit('ceddl:'+level, {
        exDescription: message,
        exFatal: level === 'error',
    });
}

/**
 * console object to allow for mocking during tests and checking if the relevant
 * console methods exist. it also allows us to emit errors on the eventbus witch
 * is handy for analytics and improvement of the application.
 *
 * field errors are special and blocked from being logged and emitted multiple
 * times during a page load. the events produces by the logger are not part of
 * the eventstore.
 */
function Logger () {
    this.fieldErrors = [];
}

Logger.prototype.log = function(message) {
    logAndEmit('log', message);
};

Logger.prototype.info = function(message) {
    logAndEmit('info', message);
};

Logger.prototype.field = function(message) {
    if (this.fieldErrors.includes(message)) {
        return;
    }
    this.fieldErrors.push(message);
    logAndEmit('warn', message);
};

Logger.prototype.warn = function(message) {
    logAndEmit('warn', message);
};

Logger.prototype.error = function(message) {
    logAndEmit('error', message);
};

export {
    logger,
    eventbus
};






